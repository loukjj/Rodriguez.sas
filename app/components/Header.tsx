"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import NotificationButton from "./NotificationButton"
import UserProfile from "./UserProfile"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      {/* Top Banner - Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo and User Info */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 font-bold text-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-2 rounded-lg flex items-center justify-center">
                <img src="/globe.svg" alt="Rodriguez" className="h-5 w-5 invert" />
              </div>
              <span className="hidden sm:block">Rodriguez</span>
            </Link>

            {/* User Profile - Only show when logged in */}
            {session && <UserProfile />}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/products" className="text-foreground hover:text-accent transition-colors font-medium">
              Productos
            </Link>
            <Link href="/welcome" className="text-foreground hover:text-accent transition-colors font-medium">
              Nosotros
            </Link>
            {session && (
              <Link href="/orders" className="text-foreground hover:text-accent transition-colors font-medium">
                Mis Pedidos
              </Link>
            )}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                  aria-label="Buscar productos"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Buscar"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications - Only for logged in users */}
            {session && <NotificationButton />}

            {/* Cart Button */}
            <Link
              href="/checkout/summary"
              className="relative p-2 text-foreground hover:text-accent transition-colors rounded-lg hover:bg-muted/50"
              aria-label="Carrito de compras"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
              </svg>
              {/* Cart indicator dot */}
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent rounded-full"></span>
            </Link>

            {/* Logout Button - Only for logged in users */}
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 text-foreground hover:text-accent transition-colors rounded-lg hover:bg-muted/50 font-medium"
                aria-label="Cerrar sesión"
              >
                Salir
              </button>
            )}

            {/* Login/Register - Only for non-logged users */}
            {!session && status !== 'loading' && (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-foreground hover:text-accent transition-colors font-medium"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                aria-label="Buscar productos"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Buscar"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  )
}