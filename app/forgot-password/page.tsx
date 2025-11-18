"use client"
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [link, setLink] = useState<string | null>(null)

  async function handle(e: any) {
    e.preventDefault()
    setMsg(null); setLink(null)
    const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    const j = await res.json()
    if (!res.ok) setMsg(j.error || 'Error')
    else {
      setMsg('Si existe una cuenta, recibirás instrucciones.')
      if (j.resetUrl) setLink(j.resetUrl)
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">¿Olvidaste tu contraseña?</h1>
      <p className="text-sm text-zinc-600 mb-4">Introduce tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" />
        </div>
  <button className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700">Enviar enlace</button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
  {link && <div className="mt-2 text-sm text-slate-600">En desarrollo: <a className="text-slate-800" href={link}>{link}</a></div>}
    </main>
  )
}
