import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Dev-only helper to mark a user as admin by email.
export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }
  try {
    const body = await req.json()
    const email = body?.email
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

    const user = await prisma.user.update({ where: { email }, data: { isAdmin: true } })
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, isAdmin: user.isAdmin } })
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 })
  }
}
