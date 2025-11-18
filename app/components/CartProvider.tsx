"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type CartItem = { productId: string; name: string; priceCents: number; quantity: number; imageUrl?: string }

type Shipping = {
  name: string
  address: string
  city: string
  postal: string
}

type CartContextValue = {
  items: CartItem[]
  add: (item: CartItem) => void
  addToCart?: (item: CartItem) => void
  remove: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clear: () => void
  totalCents: number
  shipping?: Shipping
  setShipping: (s: Shipping) => void
}

const CartContext = createContext<CartContextValue | null>(null)

function storageKey() {
  return 'app_cart_v1'
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey())
      if (raw) {
        const parsed = JSON.parse(raw)
        return parsed.items || []
      }
    } catch {}
    return []
  })
  const [shipping, setShippingState] = useState<Shipping | undefined>(() => {
    try {
      const raw = localStorage.getItem(storageKey())
      if (raw) {
        const parsed = JSON.parse(raw)
        return parsed.shipping
      }
    } catch {}
    return undefined
  })
  const pathname = usePathname()

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(), JSON.stringify({ items, shipping }))
    } catch {}
  }, [items, shipping, pathname])

  function save(next: CartItem[]) { setItems(next) }

  const add = (item: CartItem) => {
    setItems(prev => {
      const found = prev.find(p => p.productId === item.productId)
      if (found) return prev.map(p => p.productId === item.productId ? { ...p, quantity: p.quantity + item.quantity } : p)
      return [...prev, item]
    })
  }

  const remove = (productId: string) => setItems(prev => prev.filter(p => p.productId !== productId))

  const updateQty = (productId: string, qty: number) => setItems(prev => prev.map(p => p.productId === productId ? { ...p, quantity: qty } : p))

  const clear = () => { setItems([]) }

  const totalCents = items.reduce((s, i) => s + i.priceCents * i.quantity, 0)

  const setShipping = (s: Shipping) => setShippingState(s)

  return (
    <CartContext.Provider value={{ items, add, addToCart: add, remove, updateQty, clear, totalCents, shipping, setShipping }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const c = useContext(CartContext)
  if (!c) throw new Error('useCart must be inside CartProvider')
  return c
}

export type { CartItem }

export default CartProvider
