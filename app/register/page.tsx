"use client"
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [agree, setAgree] = useState(false)
  const [passwordOk, setPasswordOk] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // basic password checks: min 8, one number, one uppercase
    const ok = /(?=.{8,})(?=.*[0-9])(?=.*[A-Z])/.test(password)
    setPasswordOk(ok)
  }, [password])

  async function handleSubmit(e: any) {
    e.preventDefault()
    setMsg('')
    if (!agree) { setMsg('Acepta los términos y condiciones'); return }
    if (!passwordOk) { setMsg('La contraseña no cumple los requisitos'); return }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    const data = await res.json()
    if (!res.ok) setMsg(data.error || 'Error')
    else {
      setMsg('Registrado correctamente')
      setTimeout(() => router.push('/welcome'), 900)
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Registro</h1>

      <div className="flex flex-col gap-3 mb-4">
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
            <path d="M44 20H24v8h11.9C34.6 30.9 30 36 24 36c-7 0-13-6-13-13s6-13 13-13c3.3 0 6.3 1.2 8.6 3.2l6-6C35.5 3.8 29.1 1 24 1 11.9 1 2 10.9 2 23s9.9 22 22 22c11.4 0 21-8.1 21-22 0-1.4-.2-2.8-.6-4z" fill="#000" />
          </svg>
          Registrarse con Google
        </button>
      </div>

  <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Nombre</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Registrar</button>
        <div className="mt-2 text-sm">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} /> Acepto los <a href="/terms" className="text-slate-800">términos y condiciones</a></label>
          {!passwordOk && <p className="text-xs text-red-600 mt-1">La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número.</p>}
          {msg && <p className="mt-2">{msg}</p>}
        </div>
      </form>
    </main>
  )
}
