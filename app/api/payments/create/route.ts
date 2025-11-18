import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
// @ts-ignore
const Epayco = require('epayco-node')

const epayco = new Epayco({
  apiKey: process.env.EPAYCO_PUBLIC_KEY!,
  privateKey: process.env.EPAYCO_PRIVATE_KEY!,
  lang: 'ES',
  test: false // Set to true for sandbox
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { method, orderId } = await req.json()

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } }
    })

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Calculate total in cents, then convert to pesos
    const totalCents = order.items.reduce((sum, item) => sum + (item.priceCents * item.quantity), 0)
    const total = (totalCents / 100).toFixed(2)

    // Create payment with Epayco
    const paymentData = {
      name: `Orden #${order.id}`,
      description: `Pago de orden ${order.id}`,
      invoice: order.id,
      currency: 'COP',
      amount: total.toString(),
      tax_base: '0',
      tax: '0',
      country: 'CO',
      lang: 'ES',
      external: 'false',
      extra1: order.id,
      response: `${process.env.NEXTAUTH_URL}/checkout/thank-you?order=${order.id}`,
      confirmation: `${process.env.NEXTAUTH_URL}/api/webhooks/epayco`,
      email_billing: session.user.email!,
      methodsDisable: method === 'credit' ? ['PSE', 'Efecty'] :
                     method === 'pse' ? ['CC', 'Efecty'] :
                     ['CC', 'PSE']
    }

    const payment = await epayco.checkout.create(paymentData)

    if (payment.success) {
      // Update order with payment info
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'pending_payment',
          paymentUrl: payment.data.url,
          paymentRef: payment.data.ref_payco
        }
      })

      return NextResponse.json({
        success: true,
        paymentUrl: payment.data.url,
        ref: payment.data.ref_payco
      })
    } else {
      return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}