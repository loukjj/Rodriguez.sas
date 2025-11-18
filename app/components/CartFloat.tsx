"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from './CartProvider'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function CartFloat() {
  const { data: session } = useSession()
  const cart = useCart()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const count = cart.items.reduce((s, i) => s + i.quantity, 0)

  function gotoCheckout() {
    setOpen(false)
    // if no shipping saved, go to shipping page
    if (!cart.shipping) router.push('/checkout/shipping')
    else router.push('/checkout/payments')
  }

  // allow other components to open the cart via a global event
  useEffect(() => {
    function handler() { setOpen(true) }
    window.addEventListener('open-cart', handler)
    return () => window.removeEventListener('open-cart', handler)
  }, [])

  // only show cart UI to authenticated users
  if (!session) return null

  return (
    <>
  <button onClick={() => setOpen(true)} aria-label="Abrir carrito" className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-lg hover:scale-105 hover:bg-slate-700 transition-transform">
  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-800 font-bold">{count}</span>
        Carrito
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }} transition={{ type: 'spring' }} className="fixed top-0 right-0 z-50 h-full w-96 card p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tu carrito</h3>
              <div className="flex items-center gap-2">
                <button className="text-sm text-zinc-500" onClick={() => cart.clear()}>Vaciar</button>
                <button className="text-sm" onClick={() => setOpen(false)}>Cerrar ✕</button>
              </div>
            </div>

            {cart.items.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">Tu carrito está vacío</div>
            ) : (
              <div className="space-y-4">
                {cart.items.map(it => (
                  <div key={it.productId} className="flex items-center gap-3">
                    {it.imageUrl ? <img src={it.imageUrl} className="h-12 w-12 object-cover rounded" /> : <div className="h-12 w-12 bg-slate-100 rounded" />}
                    <div className="flex-1">
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-zinc-600">{(it.priceCents/100).toFixed(2)} x {it.quantity}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm">{((it.priceCents * it.quantity)/100).toFixed(2)}</div>
                      <div className="flex gap-1 mt-2">
                        <button className="px-2 py-0.5 text-xs border rounded" onClick={() => cart.updateQty(it.productId, Math.max(1, it.quantity-1))}>-</button>
                        <button className="px-2 py-0.5 text-xs border rounded" onClick={() => cart.updateQty(it.productId, it.quantity+1)}>+</button>
                        <button className="px-2 py-0.5 text-xs text-red-600" onClick={() => cart.remove(it.productId)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">Total <span>{(cart.totalCents/100).toFixed(2)}</span></div>
                  <div className="mt-4">
                    <button className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700" onClick={gotoCheckout}>Ir a pagar</button>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
