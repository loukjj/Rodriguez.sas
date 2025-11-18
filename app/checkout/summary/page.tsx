"use client"
import React, { useState } from 'react'
import { useCart } from '@/app/components/CartProvider'
import { useRouter } from 'next/navigation'

export default function SummaryPage() {
  const cart = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentOptions, setPaymentOptions] = useState<Array<{id:string,label:string,url:string}>>([])
  const [acceptTerms, setAcceptTerms] = useState(false)

    async function goToPayments() {
      setError(null)
      // If no shipping, go to shipping page first
      if (!cart.shipping) {
        router.push('/checkout/shipping')
        return
      }
      // Check terms acceptance
      if (!acceptTerms) {
        setError('Debes aceptar los términos y condiciones para continuar')
        return
      }

      setLoading(true)
      try {
        const res = await fetch('/api/cart/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart.items,
            shipping: cart.shipping,
            paymentMethod: 'credit' // default
          })
        })
        const data = await res.json()
        if (data.ok) {
          if (data.paymentOptions && data.paymentOptions.length > 0) {
            setPaymentOptions(data.paymentOptions)
          } else {
            // No payment options, redirect to payments page with orderId
            router.push(`/checkout/payments?orderId=${data.orderId}`)
          }
        } else {
          setError(data.error || 'Error al procesar el pedido')
        }
      } catch (err) {
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }

  if (cart.items.length === 0) return <div className="p-6">Tu carrito está vacío.</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">Resumen de compra</h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-medium text-lg mb-2">Artículos</h3>
          <ul className="divide-y">
            {cart.items.map(it => (
              <li key={it.productId} className="py-3 flex items-center gap-4">
                <img src={it.imageUrl || '/products/placeholder.png'} alt={it.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-zinc-600">{it.quantity} × ${(it.priceCents/100).toFixed(2)}</div>
                </div>
                <div className="font-medium">${((it.priceCents*it.quantity)/100).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="col-span-1 bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-medium text-lg mb-2">Detalles de pago</h3>
          <div className="mb-3">
            <div className="text-xs text-zinc-500">Envío</div>
            {cart.shipping ? (
              <div className="text-sm">{cart.shipping.name}<br />{cart.shipping.address}<br />{cart.shipping.city} {cart.shipping.postal}</div>
            ) : (
              <div className="text-sm">No hay datos de envío. <a className="text-slate-800 underline" href="/checkout/shipping">Añadir</a></div>
            )}
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between text-sm text-zinc-600"><span>Subtotal</span><span>${(cart.totalCents/100).toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-zinc-600 mt-2"><span>Envío</span><span>{cart.shipping ? '$0.00' : '—'}</span></div>
            <div className="flex justify-between font-semibold text-lg mt-3"><span>Total</span><span>${(cart.totalCents/100).toFixed(2)}</span></div>
          </div>

          {error && <div className="mt-3 text-red-600">{error}</div>}

          <div className="mt-4">
            <div className="mb-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-accent border-border rounded focus:ring-accent"
                />
                <div className="text-sm">
                  <span className="text-theme-muted">
                    Acepto los{' '}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent-2 underline"
                    >
                      términos y condiciones
                    </a>
                    {' '}y la política de privacidad
                  </span>
                </div>
              </label>
            </div>
            <button className="w-full bg-slate-800 text-white px-4 py-3 rounded hover:bg-slate-700 disabled:opacity-50" onClick={goToPayments} disabled={loading || !cart.shipping || !acceptTerms}>{loading ? 'Procesando...' : 'Pagar ahora'}</button>
            <button className="w-full mt-2 px-4 py-2 border rounded" onClick={() => router.back()}>Volver</button>
          </div>
          {/* Payment options modal-like block */}
          {paymentOptions.length > 0 && (
            <div className="mt-4 p-4 border rounded bg-white">
              <h4 className="font-medium mb-2">Elige un método de pago</h4>
              <div className="space-y-2">
                {paymentOptions.map(opt => (
                  <div key={opt.id} className="flex items-center justify-between">
                    <div>{opt.label}</div>
                    <div>
                      <button onClick={() => { window.location.href = opt.url }} className="px-3 py-1 bg-slate-800 text-white rounded hover:bg-slate-700">Pagar con {opt.label}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
