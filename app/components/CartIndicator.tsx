import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function CartIndicator() {
  const session: any = await getServerSession(authOptions as any)
  if (!session || !session.user?.email) return null

  return (
    <a href="/checkout/summary" aria-label="Carrito" className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 rounded-full bg-slate-800/90 px-3 py-2 text-sm font-medium text-white shadow-lg hover:scale-105 hover:bg-slate-700 transition-transform">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-800 font-bold">•</span>
      Carrito
    </a>
  )
}
