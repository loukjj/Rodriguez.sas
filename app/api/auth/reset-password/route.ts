import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { token, password } = await req.json()
  if (!token || !password) return NextResponse.json({ error: 'Missing' }, { status: 400 })

  const user = await prisma.user.findFirst({ where: { passwordResetToken: token } })
  if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
  }

  // validate password strength server-side
  if (password.length < 8) return NextResponse.json({ error: 'Password too short' }, { status: 400 })

  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.update({ where: { id: user.id }, data: { hashedPassword: hashed, passwordResetToken: null, passwordResetExpires: null } })

  return NextResponse.json({ ok: true })
}
