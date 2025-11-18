"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const router = useRouter()
  const params = useSearchParams()

  async function handleSignIn(e: any) {
    e.preventDefault()
    setMsg(null)
    const res: any = await signIn('credentials', { redirect: false, email, password })
    if (res?.error) {
      setMsg(String(res.error))
      return
    }

    setMsg('Inicio de sesión correcto — redirigiendo...')

    // Preferir callbackUrl si es compatible con el rol
    const cb = params?.get('callbackUrl')

    try {
      const roleRes = await fetch('/api/user/role', { cache: 'no-store' })
      const role = await roleRes.json()
      const isAdmin = !!role?.isAdmin

      // Si callback apunta a admin pero no es admin, ignorar
      if (cb) {
        const wantsAdmin = /\/admin(\b|\/)/.test(cb)
        if (wantsAdmin && !isAdmin) {
          router.push('/welcome')
          return
        }
        router.push(cb)
        return
      }

      router.push(isAdmin ? '/admin' : '/welcome')
    } catch (err) {
      router.push(cb || '/welcome')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-2xl rounded-2xl overflow-hidden">
  <motion.div whileHover={{ scale: 1.02 }} className="p-10 bg-gradient-to-br from-slate-700 to-sky-500 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold">Bienvenido de nuevo</h2>
          <p className="mt-4 text-slate-100">Inicia sesión para continuar en tu cuenta. También puedes registrarte con Google más abajo.</p>
          <div className="mt-6">
            <button
              onClick={() => signIn('google', { callbackUrl: params?.get('callbackUrl') || '/' })}
              className="inline-flex items-center gap-3 rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5" fill="none">
                <path d="M44 20H24v8h11.9C34.6 30.9 30 36 24 36c-7 0-13-6-13-13s6-13 13-13c3.3 0 6.3 1.2 8.6 3.2l6-6C35.5 3.8 29.1 1 24 1 11.9 1 2 10.9 2 23s9.9 22 22 22c11.4 0 21-8.1 21-22 0-1.4-.2-2.8-.6-4z" fill="#fff" />
              </svg>
              Continuar con Google
            </button>
          </div>
        </motion.div>

        <div className="p-8">
          <h3 className="text-xl font-semibold mb-4">Inicia sesión</h3>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <button className="w-full bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700">Entrar</button>
            {msg && <p className="text-sm mt-2 text-red-600">{msg}</p>}
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div>¿No tienes cuenta? <Link href="/register" className="text-slate-800 font-medium">Regístrate</Link></div>
            <div><Link href="/forgot-password" className="text-slate-800">¿Se te olvidó la contraseña?</Link></div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
