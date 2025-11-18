"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function TopBanner() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return localStorage.getItem('banner:dismissed') === '1'
    } catch {}
    return false
  })
  const [query, setQuery] = useState('')
  const router = useRouter()

  function closeForever() {
    try { localStorage.setItem('banner:dismissed', '1') } catch {}
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Botón flotante minimalista */}
      <motion.button
        aria-label={open ? 'Cerrar panel' : 'Abrir panel de ayuda'}
        onClick={() => setOpen(o => !o)}
        className="shadow-2 rounded-full btn btn-primary h-12 w-12 p-0"
        whileTap={{ scale: 0.98 }}
      >
        {open ? '×' : '☰'}
      </motion.button>

      {/* Panel desplegable */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="mt-3 w-[360px] max-w-[90vw] card p-3"
            role="dialog"
            aria-modal="false"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="badge badge-accent">Nuevo</span>
                <strong>Centro rápido</strong>
              </div>
              <button onClick={closeForever} className="btn btn-ghost h-8 text-sm" aria-label="No volver a mostrar">Ocultar</button>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3">
              <div className="flex gap-2">
                <input
                  aria-label="Buscar productos"
                  value={query}
                  onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
                  placeholder="Buscar productos"
                  className="input h-10"
                  onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/products?search=${encodeURIComponent(query)}`) }}
                />
                <button className="btn btn-secondary h-10" onClick={() => router.push(`/products?search=${encodeURIComponent(query)}`)}>Buscar</button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a href="/products" className="btn btn-secondary h-10">Productos</a>
                <button
                  aria-label="Abrir carrito"
                  className="btn btn-secondary h-10"
                  onClick={() => { if (typeof window !== 'undefined') window.dispatchEvent(new Event('open-cart')) }}
                >Carrito</button>
              </div>

              <div className="card p-3">
                <div className="text-xs text-muted">Cuenta</div>
                {session ? (
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <div className="text-sm truncate">{session.user?.name ?? session.user?.email}</div>
                    <div className="flex gap-2">
                      <a href="/profile" className="btn btn-ghost h-8">Perfil</a>
                      <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-ghost h-8">Salir</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <a href="/login" className="btn btn-primary h-9">Entrar</a>
                    <a href="/register" className="btn btn-secondary h-9">Crear cuenta</a>
                  </div>
                )}
              </div>

              {session?.user?.isAdmin && (
                <a href="/admin" className="btn btn-ghost h-10" aria-label="Panel administrador">Panel admin</a>
              )}
              {session?.user && (
                <button
                  onClick={() => signOut()}
                  className="btn btn-ghost h-10"
                  aria-label="Cerrar sesión"
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
