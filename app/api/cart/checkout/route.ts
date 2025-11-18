import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions as any)
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { items, shipping, paymentMethod, paymentData } = body
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'No items' }, { status: 400 })
  if (!paymentMethod) return NextResponse.json({ error: 'Payment method required' }, { status: 400 })

  // calculate total
  const total = items.reduce((s: number, it: any) => s + Number(it.priceCents || 0) * Number(it.quantity || 1), 0)

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalCents: total,
      status: 'pending',
      items: {
        create: items.map((it: any) => ({ productId: it.productId, quantity: Number(it.quantity || 1), priceCents: Number(it.priceCents || 0) }))
      }
    },
    include: { items: true }
  })

  // For now we do not persist shipping in DB (schema change). In production, add shipping fields.

  // If Epayco keys are configured, attempt to create a payment session and return a redirect URL
  try {
    const epaycoPublic = process.env.EPAYCO_PUBLIC_KEY
    const epaycoPrivate = process.env.EPAYCO_PRIVATE_KEY
    if (epaycoPublic && epaycoPrivate) {
      // Build payload according to Epayco checkout session API
      const payload: any = {
        public_key: epaycoPublic,
        amount: (total / 100), // Epayco expects amount in currency units
        currency: 'COP',
        name: `Pedido ${order.id}`,
        description: `Compra de ${items.length} artículo(s)`,
        invoice: String(order.id),
        tax_base: 0,
        tax: 0,
        // Where the user is redirected after payment
        url_response: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || ''}/checkout/thank-you?order=${order.id}`,
        // Epayco confirmation webhook endpoint
        url_confirmation: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || ''}/api/webhooks/epayco`
      }

      // Add payment method specific data
      if (paymentMethod === 'PSE') {
        payload.type = 'PSE'
        if (paymentData) {
          payload.customer = {
            name: paymentData.name || user.name || 'Cliente',
            email: paymentData.email,
            phone: paymentData.phone,
            doc_type: paymentData.docType,
            doc_number: paymentData.docNumber
          }
          payload.bank = paymentData.bank
        }
      } else if (paymentMethod === 'Efecty') {
        payload.type = 'EFECTY'
      } else if (paymentMethod === 'Tarjeta de Crédito/Débito') {
        // Default is card payment
        if (paymentData) {
          payload.customer = {
            name: paymentData.name,
            email: user.email
          }
        }
      }

      const resp = await fetch('https://api.secure.payco.co/checkout/v1/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (resp.ok) {
        const data = await resp.json()
        const paymentUrl = data?.data?.url || data?.data?.url_checkout || null
        if (paymentUrl) {
          // collect as an option list (for multiple providers)
          return NextResponse.json({ ok: true, orderId: order.id, paymentOptions: [{ id: 'epayco', label: 'Epayco', url: paymentUrl }] })
        }
      }
    }
  } catch (err) {
    console.warn('Epayco session creation failed', err)
  }

  // Try to create MercadoPago preference if configured
  try {
    const mpToken = process.env.MP_ACCESS_TOKEN
    if (mpToken) {
      const itemsMp = items.map((it: any) => ({ title: it.name || 'Producto', quantity: Number(it.quantity || 1), unit_price: (Number(it.priceCents || 0) / 100), currency_id: 'COP' }))
      const mpPayload = {
        items: itemsMp,
        external_reference: String(order.id),
        back_urls: {
          success: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || ''}/checkout/thank-you?order=${order.id}`,
          failure: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || ''}/checkout/thank-you?order=${order.id}`,
          pending: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || ''}/checkout/thank-you?order=${order.id}`
        },
        notification_url: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || ''}/api/webhooks/mercadopago`
      }

      const mpResp = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${mpToken}` },
        body: JSON.stringify(mpPayload)
      })

      if (mpResp.ok) {
        const mpData = await mpResp.json()
        const mpUrl = mpData?.init_point || mpData?.sandbox_init_point || null
        if (mpUrl) {
          return NextResponse.json({ ok: true, orderId: order.id, paymentOptions: [{ id: 'mercadopago', label: 'MercadoPago', url: mpUrl }] })
        }
      }
    }
  } catch (err) {
    console.warn('MercadoPago preference creation failed', err)
  }

  // If nothing else, return order id only
  return NextResponse.json({ ok: true, orderId: order.id })
}
