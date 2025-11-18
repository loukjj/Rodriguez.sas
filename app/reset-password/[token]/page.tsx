"use client"
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function ResetPage() {
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const token = params?.token

  async function handle(e: any) {
    e.preventDefault()
    setMsg(null)
    const res = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) })
    const j = await res.json()
    if (!res.ok) setMsg(j.error || 'Error')
    else {
      setMsg('Contraseña restablecida. Redirigiendo...')
      setTimeout(() => router.push('/'), 1200)
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Restablecer contraseña</h1>
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label className="block text-sm">Nueva contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" />
        </div>
  <button className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700">Restablecer</button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </main>
  )
}
