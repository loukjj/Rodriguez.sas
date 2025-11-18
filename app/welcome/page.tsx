"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 p-8">
      <motion.section initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
  <div className="p-10 bg-gradient-to-br from-slate-700 to-sky-500 text-white">
          <h1 className="text-4xl font-extrabold">¡Listo para explorar!</h1>
          <p className="mt-4 text-slate-100">Bienvenido. Ahora puedes visitar nuestra colección y descubrir productos destacados, ver demostraciones en video y comprar fácilmente.</p>
          <div className="mt-6">
            <Link href="/products" className="inline-flex items-center gap-3 rounded-md bg-white/20 px-4 py-2 font-medium hover:bg-white/30">Ver productos</Link>
          </div>
        </div>

        <div className="p-8 flex flex-col justify-center gap-4">
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-lg bg-zinc-50 p-4 shadow-sm">
            <h3 className="font-semibold">Tu cuenta está activa</h3>
            <p className="text-sm text-zinc-600 mt-2">Puedes navegar, añadir al carrito y completar compras. También puedes volver a la página principal en cualquier momento.</p>
          </motion.div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="rounded-lg bg-white p-4 shadow">
            <h4 className="font-semibold">Atajos</h4>
            <ul className="mt-2 text-sm text-zinc-600 space-y-2">
              <li><Link href="/products" className="text-slate-800">Ir a productos</Link></li>
              <li><Link href="/upload" className="text-slate-800">Subir producto (demo)</Link></li>
              <li><Link href="/register" className="text-slate-800">Editar perfil</Link></li>
            </ul>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
