"use client"
import { useState } from 'react'

export default function PurchaseModal({ productId }: { productId: string; }) {
  const [open, setOpen] = useState(false)

  function handleBuy() {
    window.location.href = '/checkout/payments'
  }

  return (
    <div>
      <button onClick={() => setOpen(true)} className="rounded-md bg-slate-800 text-white px-3 py-1 hover:bg-slate-700">Comprar</button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md card p-6">
            <h3 className="text-lg font-semibold">Confirmar Compra</h3>
            <p className="text-sm mt-2">
              Serás redirigido a la selección de métodos de pago para finalizar tu compra.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost h-9">Cancelar</button>
              <button onClick={handleBuy} className="btn btn-primary h-9">Ir a pagar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
