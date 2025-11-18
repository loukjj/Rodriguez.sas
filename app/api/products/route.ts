import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  // Return products from DB. If empty, seed a few example products (local dev convenience).
  const existing = await prisma.product.findMany()
  if (existing.length > 0) return NextResponse.json(existing)

  const sample = [
    { name: 'Aurora Lamp', description: 'Lámpara decorativa con luz cálida y diseño moderno.', priceCents: 7999, imageUrl: '/products/lamp.svg' },
    { name: 'Linea Chair', description: 'Silla ergonómica con acabado en madera natural.', priceCents: 12999, imageUrl: '/products/chair.svg' },
    { name: 'Cloud Sofa', description: 'Sofá modular para espacios contemporáneos.', priceCents: 49999, imageUrl: '/products/sofa.svg' },
    { name: 'Terra Table', description: 'Mesa centro con diseño minimalista y duradero.', priceCents: 21999, imageUrl: '/products/table.svg' },
  ]

  const created = await prisma.product.createMany({ data: sample })
  const all = await prisma.product.findMany()
  return NextResponse.json(all)
}
