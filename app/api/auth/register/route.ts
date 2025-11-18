import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body
    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'user_exists' }, { status: 409 })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({ data: { name, email, hashedPassword } })

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    console.error('register error', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
