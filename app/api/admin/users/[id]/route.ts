import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface UpdateUserBody {
  name?: string
  isAdmin?: boolean
  imageUrl?: string
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const adminUser = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!adminUser || !adminUser.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body: UpdateUserBody = await req.json()
  const dataToUpdate: { name?: string; isAdmin?: boolean; image?: string } = {}
  if (body.name !== undefined) dataToUpdate.name = body.name
  if (typeof body.isAdmin === 'boolean') dataToUpdate.isAdmin = body.isAdmin
  if (body.imageUrl !== undefined) dataToUpdate.image = body.imageUrl

  const updated = await prisma.user.update({ where: { id }, data: dataToUpdate })
  return NextResponse.json({ ok: true, user: { id: updated.id, email: updated.email, isAdmin: !!updated.isAdmin, image: updated.image ?? null } })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const adminUser = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!adminUser || !adminUser.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
