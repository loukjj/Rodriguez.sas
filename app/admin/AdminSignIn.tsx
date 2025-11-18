"use client"
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AdminSignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [show, setShow] = useState(false)
  const [prefilled, setPrefilled] = useState(false)
  const router = useRouter()
  const params = useSearchParams()

  async function handle(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    const res: any = await signIn('credentials', { redirect: false, email, password })
    if (res?.error) setMsg(String(res.error))
    else {
      setMsg('Inicio de sesión correcto — redirigiendo...')
      const callback = params?.get('callbackUrl') || '/admin'
      setTimeout(() => router.push(callback), 600)
    }
  }

  function fillDemo() {
    setEmail('admin.real@local.test')
    setPassword('Str0ngP@ssw0rd!')
    setPrefilled(true)
    setMsg('Credenciales de prueba rellenadas. Pulsa Entrar.')
  }

  return (
    <div className="flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-slate-800 text-white font-bold px-3 py-1 rounded-md">ADMIN</div>
          <h3 className="text-xl font-semibold">Acceso Administrador</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">Introduce las credenciales de administrador aquí. Puedes usar el botón de demo para autocompletar credenciales de prueba en entorno local.</p>

        {/* Demo credentials visible card (development only) */}
        <motion.div whileHover={{ scale: 1.02 }} className="mb-4 p-3 border rounded-md bg-gradient-to-r from-yellow-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Credenciales de prueba</div>
              <div className="font-mono text-sm">Email: <span className="font-semibold">admin.real@local.test</span></div>
              <div className="font-mono text-sm">Password: <span className="font-semibold">Str0ngP@ssw0rd!</span></div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="px-3 py-1 bg-slate-800 text-white rounded text-sm" onClick={fillDemo}>Usar</button>
              <button className="px-3 py-1 border rounded text-sm" onClick={() => { navigator.clipboard?.writeText('admin.real@local.test\nStr0ngP@ssw0rd!') }}>Copiar</button>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handle} className="space-y-3">
          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@ejemplo" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Contraseña</label>
            <div className="flex items-center gap-2">
              <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="********" className="flex-1 border p-2 rounded" />
              <button type="button" onClick={() => setShow(s => !s)} className="text-sm text-slate-800">{show ? 'Ocultar' : 'Mostrar'}</button>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700" type="submit">Entrar</button>
            <button type="button" onClick={fillDemo} className="flex-1 border px-4 py-2 rounded">Rellenar demo</button>
          </div>

          {msg && <p className="text-sm mt-2 text-red-600">{msg}</p>}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: prefilled ? 1 : 0 }} transition={{ duration: 0.3 }} className="text-xs text-slate-500 mt-2">
            Nota: el botón de demo inserta credenciales de prueba en entorno local. No uses en producción.
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}
