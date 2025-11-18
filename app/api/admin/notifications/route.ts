import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { userIds, title, message } = await request.json()

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 })
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'At least one user ID is required' }, { status: 400 })
    }

    // Create notifications for each user
    const notifications = userIds.map((userId: string) => ({
      userId,
      title,
      message,
    }))

    await prisma.notification.createMany({
      data: notifications,
    })

    return NextResponse.json({ success: true, count: notifications.length })
  } catch (error) {
    console.error('Error sending notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}