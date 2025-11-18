"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function UserProfile() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (!session) return null

  const userInitials = session.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : session.user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <div className="relative">
      {/* User Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        aria-label="Perfil de usuario"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-accent"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-accent">
            {userInitials}
          </div>
        )}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-foreground">
            {session.user?.name || 'Usuario'}
          </div>
          <div className="text-xs text-muted-foreground">
            Cliente
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {/* User Info Header */}
              <div className="p-6 border-b border-border bg-gradient-to-r from-accent/5 to-accent-2/5">
                <div className="flex items-center gap-4">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover border-2 border-accent"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center text-white font-semibold border-2 border-accent">
                      {userInitials}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">
                      {session.user?.name || 'Usuario'}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {session.user?.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                        Cliente Premium
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-b border-border">
                <h4 className="font-medium text-foreground mb-3">Acciones Rápidas</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/orders"
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs font-medium">Mis Pedidos</span>
                  </Link>

                  <Link
                    href="/checkout/summary"
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
                    </svg>
                    <span className="text-xs font-medium">Carrito</span>
                  </Link>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <div className="font-medium">Mi Perfil</div>
                    <div className="text-xs text-muted-foreground">Información personal y direcciones</div>
                  </div>
                </Link>

                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <div>
                    <div className="font-medium">Rastreo de Pedidos</div>
                    <div className="text-xs text-muted-foreground">Estado y seguimiento en tiempo real</div>
                  </div>
                </Link>

                <div className="border-t border-border my-2"></div>

                <Link
                  href="/welcome"
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-medium">Centro de Ayuda</div>
                    <div className="text-xs text-muted-foreground">Preguntas frecuentes y soporte</div>
                  </div>
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="font-medium">Configuración</div>
                    <div className="text-xs text-muted-foreground">Preferencias y privacidad</div>
                  </div>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}