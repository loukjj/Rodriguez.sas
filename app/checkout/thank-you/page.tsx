import React from 'react'

export default async function ThankYouPage({ searchParams }: { searchParams?: Promise<{ order?: string }> }) {
  const params = await searchParams
  const orderId = params?.order || ''
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-2">Gracias por tu compra</h1>
        <p className="text-sm text-zinc-600">Hemos recibido tu orden.</p>
        {orderId && (
          <div className="mt-4 p-4 bg-slate-50 rounded">
            <div className="text-xs text-zinc-500">Número de pedido</div>
            <div className="font-mono font-semibold">{orderId}</div>
          </div>
        )}

        <div className="mt-4">
          <p className="text-sm">Si pagaste mediante el proveedor, serás redirigido de vuelta y recibiremos la confirmación automáticamente (webhook). Revisa tu correo para más detalles.</p>
        </div>
      </div>
    </div>
  )
}
