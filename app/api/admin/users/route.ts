import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import bcrypt from 'bcryptjs'

interface CreateUserBody {
  name?: string
  email: string
  password: string
  isAdmin?: boolean
}

export async function GET() {
  // Return users with a lightweight 'active' flag based on active sessions
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  const now = new Date()
  const enriched = await Promise.all(users.map(async (u) => {
    const activeCount = await prisma.session.count({ where: { userId: u.id, expires: { gt: now } } })
    return { id: u.id, name: u.name, email: u.email, isAdmin: u.isAdmin ?? false, createdAt: u.createdAt, activeSessions: activeCount }
  }))
  return NextResponse.json(enriched)
}

export async function POST(req: Request) {
  // create user (admin only)
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const adminUser = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!adminUser || !adminUser.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body: CreateUserBody = await req.json()
  const { name, email, password, isAdmin } = body
  if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name: name ?? null, email, hashedPassword, isAdmin: !!isAdmin } })
  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, isAdmin: !!user.isAdmin } })
}
