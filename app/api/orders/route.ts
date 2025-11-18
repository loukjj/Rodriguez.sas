import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'
import type { Session } from 'next-auth'

export async function GET() {
  const session = await getServerSession(authOptions) as Session | null
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ orders })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as Session | null
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { productId, quantity = 1 } = body
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  const total = product.priceCents * Number(quantity)

  // find user
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalCents: total,
      status: 'pending',
      items: {
        create: [{ productId: product.id, quantity: Number(quantity), priceCents: product.priceCents }]
      }
    },
    include: { items: true }
  })

  return NextResponse.json({ ok: true, orderId: order.id })
}
