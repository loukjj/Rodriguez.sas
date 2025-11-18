import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: any) {
  const session: any = await getServerSession(authOptions as any)
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = params?.id
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true }
  })
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // ensure the user owns the order (admins could be allowed to view others)
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (order.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  return NextResponse.json({ ok: true, order })
}
