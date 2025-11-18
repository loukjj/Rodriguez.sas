"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from "../components/ProductCard"
import Breadcrumb from "../components/Breadcrumb"
import { motion } from "framer-motion"
import Link from "next/link"
import type { Product } from '@prisma/client'

export default function ProductsClient() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [sort, setSort] = useState("featured")

  useEffect(() => {
    let mounted = true
    fetch('/api/products')
      .then((r) => r.json())
      .then((j) => mounted && setProducts(j || []))
      .catch(() => mounted && setProducts([]))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    if (!products) return []
    let list = products.slice()
    if (query) list = list.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || (p.description || '').toLowerCase().includes(query.toLowerCase()))
    if (category) list = list.filter(p => (p.description || '').toLowerCase().includes(category.toLowerCase()) || p.name.toLowerCase().includes(category.toLowerCase()))
    if (sort === 'price_asc') list.sort((a,b)=>a.priceCents-b.priceCents)
    if (sort === 'price_desc') list.sort((a,b)=>b.priceCents-a.priceCents)
    return list
  }, [products, query, category, sort])

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Decorative animated background (fallback) */}
      <div className="decorative-video-fallback" aria-hidden>
        <div className="decorative-wave" />
      </div>

      {/* Optional video: place a file at public/product-video.mp4 to enable a real video background */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-30 pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/product-video.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <Breadcrumb items={[
          { label: "Inicio", href: "/" },
          { label: "Productos" }
        ]} />

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Mercado - Colección</h2>
            <p className="text-sm text-zinc-600">Accede para ver y comprar nuestros productos exclusivos.</p>
          </div>

          <div className="flex items-center gap-3">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar productos" className="border rounded px-3 py-2" />
            <select value={sort} onChange={e=>setSort(e.target.value)} className="border rounded px-3 py-2">
              <option value="featured">Recomendados</option>
              <option value="price_asc">Precio: Menor</option>
              <option value="price_desc">Precio: Mayor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="rounded-lg bg-white p-4 shadow">
              <h4 className="font-semibold flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Categorías
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                  <a href="#" className="hover:text-accent transition-colors duration-200 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Iluminación
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent-2 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                  <a href="#" className="hover:text-accent-2 transition-colors duration-200 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Mobiliario
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent-3 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                  <a href="#" className="hover:text-accent-3 transition-colors duration-200 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Decoración
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-warning rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></span>
                  <a href="#" className="hover:text-warning transition-colors duration-200 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Ofertas
                  </a>
                </li>
              </ul>
            </motion.div>
          </aside>

          <section className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading && <div className="col-span-full text-center text-zinc-500">Cargando productos...</div>}
              {!loading && filtered.length === 0 && <div className="col-span-full text-center text-zinc-500">No se encontraron productos.</div>}
              {filtered.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} className="block">
                  <ProductCard product={p} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
