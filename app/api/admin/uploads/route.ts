import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  // Verify session and admin
  const session: any = await getServerSession(authOptions as any)
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user: any = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || !user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const form = await req.formData()
    const file = form.get('file') as any
    if (!file || typeof file.name !== 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Basic validation: only allow images and videos, restrict size to 10MB
    const mime = (file.type as string) || ''
    const maxBytes = 10 * 1024 * 1024 // 10MB
    const size = typeof file.size === 'number' ? file.size : undefined
    if (!mime.startsWith('image/') && !mime.startsWith('video/')) {
      return NextResponse.json({ error: 'Only image or video uploads are allowed' }, { status: 415 })
    }
    if (size !== undefined && size > maxBytes) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 413 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.promises.mkdir(uploadsDir, { recursive: true })

  const origName = path.basename(file.name)
  const timestamp = Date.now()
  const safeName = `${timestamp}-${origName}`
  const filePath = path.join(uploadsDir, safeName)
  await fs.promises.writeFile(filePath, buffer)
  return NextResponse.json({ ok: true, path: `/uploads/${safeName}` })
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 })
  }
}
