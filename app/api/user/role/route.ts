import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions as any)
    if (!session || !session.user?.email) {
      return NextResponse.json({ isAuthenticated: false, isAdmin: false }, { status: 200 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { isAdmin: true } })
    return NextResponse.json({ isAuthenticated: true, isAdmin: !!user?.isAdmin }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ isAuthenticated: false, isAdmin: false, error: 'role_lookup_failed' }, { status: 200 })
  }
}
