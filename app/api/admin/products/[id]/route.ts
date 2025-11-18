import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session: any = await getServerSession(authOptions as any)
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user: any = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || !user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  const updateData: any = {}

  // Basic information
  if (body.name !== undefined) updateData.name = body.name
  if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription
  if (body.description !== undefined) updateData.description = body.description
  if (body.priceCents !== undefined) updateData.priceCents = Number(body.priceCents)
  if (body.originalPriceCents !== undefined) updateData.originalPriceCents = body.originalPriceCents ? Number(body.originalPriceCents) : null

  // Images and media
  if (body.images !== undefined) updateData.images = body.images

  // Categorization
  if (body.category !== undefined) updateData.category = body.category
  if (body.brand !== undefined) updateData.brand = body.brand

  // Dimensions and specifications
  if (body.widthCm !== undefined) updateData.widthCm = body.widthCm ? Number(body.widthCm) : null
  if (body.heightCm !== undefined) updateData.heightCm = body.heightCm ? Number(body.heightCm) : null
  if (body.depthCm !== undefined) updateData.depthCm = body.depthCm ? Number(body.depthCm) : null
  if (body.weightKg !== undefined) updateData.weightKg = body.weightKg ? Number(body.weightKg) : null
  if (body.material !== undefined) updateData.material = body.material
  if (body.color !== undefined) updateData.color = body.color
  if (body.size !== undefined) updateData.size = body.size

  // Variants and additional info
  if (body.variants !== undefined) updateData.variants = body.variants
  if (body.usage !== undefined) updateData.usage = body.usage
  if (body.careInstructions !== undefined) updateData.careInstructions = body.careInstructions
  if (body.warranty !== undefined) updateData.warranty = body.warranty
  if (body.deliveryTime !== undefined) updateData.deliveryTime = body.deliveryTime

  // Inventory and status
  if (body.stock !== undefined) updateData.stock = Number(body.stock)
  if (body.isActive !== undefined) updateData.isActive = body.isActive
  if (body.isOnSale !== undefined) updateData.isOnSale = body.isOnSale
  if (body.salePercentage !== undefined) updateData.salePercentage = body.salePercentage ? Number(body.salePercentage) : null

  // SEO
  if (body.seoTitle !== undefined) updateData.seoTitle = body.seoTitle
  if (body.seoDescription !== undefined) updateData.seoDescription = body.seoDescription
  if (body.tags !== undefined) updateData.tags = body.tags

  const updated = await prisma.product.update({ where: { id }, data: updateData })
  return NextResponse.json({ ok: true, product: updated })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session: any = await getServerSession(authOptions as any)
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user: any = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || !user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
