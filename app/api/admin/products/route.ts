import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  // only admins
  const session: any = await getServerSession(authOptions as any)
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user: any = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || !user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const {
    name, shortDescription, description, priceCents, originalPriceCents,
    images, category, brand, widthCm, heightCm, depthCm, weightKg,
    material, color, size, variants, usage, careInstructions, warranty,
    deliveryTime, stock, isActive, isOnSale, salePercentage,
    seoTitle, seoDescription, tags
  } = body

  if (!name || !priceCents) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  const product = await prisma.product.create({
    data: {
      name,
      shortDescription: shortDescription || null,
      description: description || null,
      priceCents: Number(priceCents),
      originalPriceCents: originalPriceCents ? Number(originalPriceCents) : null,
      images: images || null,
      category: category || null,
      brand: brand || null,
      widthCm: widthCm ? Number(widthCm) : null,
      heightCm: heightCm ? Number(heightCm) : null,
      depthCm: depthCm ? Number(depthCm) : null,
      weightKg: weightKg ? Number(weightKg) : null,
      material: material || null,
      color: color || null,
      size: size || null,
      variants: variants || null,
      usage: usage || null,
      careInstructions: careInstructions || null,
      warranty: warranty || null,
      deliveryTime: deliveryTime || null,
      stock: Number(stock) || 0,
      isActive: isActive !== undefined ? isActive : true,
      isOnSale: isOnSale || false,
      salePercentage: salePercentage ? Number(salePercentage) : null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      tags: tags || null
    }
  })
  return NextResponse.json({ ok: true, product })
}
