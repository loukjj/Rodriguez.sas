import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const raw = await req.text()
    const body = JSON.parse(raw || '{}')

    // Si se proporciona una clave en env, intentamos validar la firma HMAC
    const signatureHeader = (req.headers.get('x-epayco-signature') || req.headers.get('x-signature') || '')
    const secret = process.env.EPAYCO_PRIVATE_KEY
    if (secret && signatureHeader) {
      const hmac = crypto.createHmac('sha256', secret).update(raw).digest('hex')
      if (hmac !== signatureHeader) {
        console.warn('Epayco webhook signature mismatch')
        return NextResponse.json({ error: 'invalid_signature' }, { status: 400 })
      }
    }

    console.log('Epayco webhook received:', body)

    // Mapear y actualizar orden de forma idempotente
    try {
      const orderId = body?.data?.order_id
      const status = body?.data?.status || body?.status
      if (orderId) {
        await prisma.order.updateMany({
          where: { id: orderId },
          data: { status: status || 'paid' }
        })
      }
    } catch (e) {
      console.warn('Order update failed', e)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('epayco webhook error', err)
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }
}
