"use client"
import { useState } from 'react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [msg, setMsg] = useState('')

  async function handleUpload(e: any) {
    e.preventDefault()
    if (!file) return setMsg('Selecciona un archivo')

    setMsg('Solicitando URL...')
    const res = await fetch('/api/uploads/presigned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: file.type })
    })
    const data = await res.json()
    if (!res.ok) return setMsg(data.error || 'Error obteniendo URL')

    setMsg('Subiendo archivo...')
    const upload = await fetch(data.url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
    if (!upload.ok) return setMsg('Error en upload')

    setMsg('Subida completa: ' + data.key)
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Subida de archivos (presigned)</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Subir</button>
      </form>
      {msg && <p className="mt-2">{msg}</p>}
    </main>
  )
}
