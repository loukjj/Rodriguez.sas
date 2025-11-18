"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import ProductCard from "./components/ProductCard"
import type { Product } from '@prisma/client'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/products')
      .then(r => {
        if (!r.ok) throw new Error('Error al cargar productos')
        return r.json()
      })
      .then(j => {
        if (mounted) {
          setProducts(Array.isArray(j) ? j.slice(0, 6) : [])
          setError(null)
        }
      })
      .catch(err => {
        if (mounted) {
          setProducts([])
          setError(err.message || 'Error al cargar productos')
        }
      })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="section">
        <div className="container">
          {/* Promotional Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-8">
            <motion.h1
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent enhanced-text-animated"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Transforma tu hogar con estilo
            </motion.h1>
            <motion.p
              className="mt-4 text-lg md:text-xl text-muted max-w-2xl mx-auto letter-dance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {"Somos líderes en muebles y decoración de alta calidad. Diseñamos espacios únicos que reflejan tu personalidad.".split("").map((char, index) => (
                <span key={index}>{char === " " ? "\u00A0" : char}</span>
              ))}
            </motion.p>
          </motion.div>

          {/* What We Do */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <img src="/products/chair.svg" alt="Muebles" className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Muebles Exclusivos</h3>
              <p className="text-sm text-muted">Colecciones diseñadas por expertos para cada rincón de tu hogar.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-2/10 flex items-center justify-center">
                <img src="/products/lamp.svg" alt="Iluminación" className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Iluminación Premium</h3>
              <p className="text-sm text-muted">Lámparas y accesorios que crean ambientes mágicos y funcionales.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-3/10 flex items-center justify-center">
                <img src="/products/sofa.svg" alt="Decoración" className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Decoración Completa</h3>
              <p className="text-sm text-muted">Todo lo que necesitas para un hogar moderno y elegante.</p>
            </div>
          </motion.div>

          {/* Trust Badges and Logos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
              <img src="/globe.svg" alt="Global" className="w-5 h-5" />
              <span className="text-sm font-medium">Envíos Nacionales</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
              <span className="text-sm font-medium">⭐ 4.9/5 Calificación</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
              <span className="text-sm font-medium">🏆 Mejor Tienda 2024</span>
            </div>
          </motion.div>

          {/* Product Showcase Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            <img src="/products/chair.svg" alt="Sillas" className="w-full h-24 object-contain bg-card p-4 rounded-lg border border-border" />
            <img src="/products/table.svg" alt="Mesas" className="w-full h-24 object-contain bg-card p-4 rounded-lg border border-border" />
            <img src="/products/sofa.svg" alt="Sofás" className="w-full h-24 object-contain bg-card p-4 rounded-lg border border-border" />
            <img src="/products/lamp.svg" alt="Lámparas" className="w-full h-24 object-contain bg-card p-4 rounded-lg border border-border" />
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <p className="text-lg mb-6">Únete a miles de clientes satisfechos. Crea tu cuenta y comienza a diseñar tu hogar perfecto.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="btn btn-primary">Crear cuenta gratis</Link>
              <Link href="/login" className="btn btn-secondary">Iniciar sesión</Link>
              <Link href="/products" className="btn btn-ghost">Explorar catálogo</Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="badge badge-accent">Envíos gratis desde $99</span>
              <span className="badge badge-muted">Devoluciones en 30 días</span>
              <span className="badge badge-accent">Pago seguro 100%</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-theme text-animated">Sobre Nosotros</h2>
            <p className="text-lg text-theme-muted max-w-3xl mx-auto letter-animated">
              Somos apasionados por transformar espacios en hogares únicos. Con años de experiencia en el diseño y fabricación de muebles premium, combinamos calidad excepcional con precios accesibles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <h3 className="text-2xl font-semibold mb-6 text-theme">Nuestra Historia</h3>
              <p className="text-theme-muted mb-4">
                Fundada con la visión de hacer que el diseño de interiores sea accesible para todos, hemos crecido de un pequeño taller a una empresa líder en muebles personalizados.
              </p>
              <div className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center mt-1 animate-pulse">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-theme">Experiencia Comprobada</h4>
                    <p className="text-sm text-theme-muted">Más de 10 años creando espacios únicos para miles de clientes satisfechos.</p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-2 flex items-center justify-center mt-1 animate-bounce">
                    <span className="text-white text-xs font-bold">★</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-theme">Calidad Premium</h4>
                    <p className="text-sm text-theme-muted">Utilizamos materiales de primera calidad y técnicas artesanales tradicionales.</p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-3 flex items-center justify-center mt-1 animate-spin">
                    <span className="text-white text-xs font-bold">$</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-theme">Precios Competitivos</h4>
                    <p className="text-sm text-theme-muted">Ofrecemos el mejor valor sin comprometer la calidad ni el diseño.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <motion.img
                  src="/uploads/1762731451668-ornameentador.webp"
                  alt="Muebles premium"
                  className="w-full h-48 object-cover rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.img
                  src="/uploads/1763347082191-Captura de pantalla (1).png"
                  alt="Diseño de interiores"
                  className="w-full h-48 object-cover rounded-lg shadow-lg mt-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -bottom-6 -right-6 bg-accent text-white p-4 rounded-full shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">5000+</div>
                  <div className="text-sm">Clientes felices</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="card p-6">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </motion.div>
              <h4 className="font-semibold mb-2 text-theme">Premio a la Excelencia</h4>
              <p className="text-sm text-theme-muted">Reconocidos por nuestro compromiso con la calidad y el servicio.</p>
            </div>
            <div className="card p-6">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-2/10 flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </motion.div>
              <h4 className="font-semibold mb-2 text-theme">Innovación Constante</h4>
              <p className="text-sm text-theme-muted">Siempre a la vanguardia del diseño y las tendencias modernas.</p>
            </div>
            <div className="card p-6">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent-3/10 flex items-center justify-center">
                <span className="text-2xl">❤️</span>
              </motion.div>
              <h4 className="font-semibold mb-2 text-theme">Satisfacción Garantizada</h4>
              <p className="text-sm text-theme-muted">Tu felicidad es nuestra prioridad. Devoluciones sin complicaciones.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="section">
        <div className="container">
          <h2 className="mb-4">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Sillas', icon: '/products/chair.svg' },
              { label: 'Mesas', icon: '/products/table.svg' },
              { label: 'Sofás', icon: '/products/sofa.svg' },
              { label: 'Lámparas', icon: '/products/lamp.svg' },
            ].map((c) => (
              <Link
                key={c.label}
                href={`/products?category=${encodeURIComponent(c.label)}`}
                className="card card-accent p-4 flex items-center gap-3 hover:shadow-2 transition-shadow"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.icon} alt={c.label} className="h-8 w-8" />
                <div className="font-semibold">{c.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="section">
        <div className="container">
          <div className="flex items-end justify-between mb-4">
            <h2>Destacados</h2>
            <Link href="/products" className="small underline">Ver todo</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              Array.from({ length: 6 }).map((_,i)=> (
                <div key={i} className="card p-4">
                  <div className="skeleton h-40 round-md" />
                  <div className="skeleton h-4 w-2/3 mt-3 round-sm" />
                  <div className="skeleton h-4 w-1/3 mt-2 round-sm" />
                </div>
              ))
            )}
            {!loading && products.length === 0 && !error && (
              <div className="small">No hay productos disponibles.</div>
            )}
            {!loading && error && (
              <div className="small text-danger">Error: {error}</div>
            )}
            {!loading && products.map(p => (
              <Link key={p.id} href={`/products/${p.id}`} className="block">
                <ProductCard product={p} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS / TRUST */}
      <section className="section">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { t: 'Envío gratuito', d: 'A partir de $99 en pedidos nacionales.'},
            { t: '30 días devolución', d: 'Si no te encanta, te devolvemos el dinero.'},
            { t: 'Pago seguro', d: 'Protección en cada compra y varias opciones.'},
          ].map((b) => (
            <div key={b.t} className="card p-4">
              <div className="font-semibold">{b.t}</div>
              <div className="small mt-1">{b.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="section">
        <div className="container">
          <h2 className="mb-4">Lo que dicen nuestros clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { n: 'María', r: 'Excelente calidad y entrega a tiempo. Mi sala cambió por completo.'},
              { n: 'Carlos', r: 'Atención impecable y productos premium. 100% recomendado.'},
              { n: 'Luisa', r: 'El proceso de compra fue muy sencillo y los acabados son perfectos.'},
            ].map((t) => (
              <motion.blockquote key={t.n} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .35 }} className="card p-4">
                <p>“{t.r}”</p>
                <footer className="small mt-2">— {t.n}</footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES */}
      <section className="section">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: '¿Cuál es el tiempo de entrega?', a: 'Entre 2 y 5 días hábiles en ciudades principales.'},
            { q: '¿Puedo devolver un producto?', a: 'Sí, dentro de los 30 días posteriores a la compra.'},
            { q: '¿Tienen garantía?', a: 'Todos nuestros productos cuentan con garantía del fabricante.'},
            { q: '¿Qué métodos de pago aceptan?', a: 'Tarjeta de crédito, PSE y Efecty.'},
          ].map((f) => (
            <details key={f.q} className="card p-4">
              <summary className="font-semibold cursor-pointer">{f.q}</summary>
              <p className="mt-2 small">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section">
        <div className="container">
          <div className="card p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2">
              <h3>Recibe novedades y ofertas</h3>
              <p className="small mt-1">Te enviaremos descuentos exclusivos y lo mejor de nuestras colecciones.</p>
            </div>
            <form className="flex gap-2" onSubmit={(e)=>{e.preventDefault(); alert('Gracias, te mantendremos al día.')}}>
              <input className="input h-12 flex-1" placeholder="tu@email.com" aria-label="Email" />
              <button className="btn btn-primary h-12" type="submit">Suscribirme</button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section">
        <div className="container text-center">
          <h2>Listo para transformar tu hogar</h2>
          <p className="mt-2">Explora nuestra colección y descubre piezas únicas.</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/products" className="btn btn-primary">Ver catálogo</Link>
            <Link href="/checkout/summary" className="btn btn-secondary">Pagar ahora</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
