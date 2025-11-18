import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import AdminClient from './AdminClient'
import AdminSignIn from './AdminSignIn'

export default async function AdminPage() {
  const session: any = await getServerSession(authOptions as any)

  if (!session || !session.user?.email) {
    // show inline admin sign-in located where the user image/area would be
    return (
      <div className="p-8">
        <AdminSignIn />
      </div>
    )
  }

  const user: any = await prisma.user.findUnique({ where: { email: session.user.email } })

  if (!user || !user.isAdmin) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold">Acceso denegado</h2>
          <p>Esta área está restringida a administradores.</p>
        </div>

        {/* Allow switching account / signing in as admin inline */}
        <div>
          <p className="text-sm text-zinc-600 mb-2">Si tienes credenciales de administrador, inicia sesión a continuación:</p>
          <div className="flex items-center gap-3">
            <AdminSignIn />
            <a href="/login?callbackUrl=/admin" className="text-sm underline text-slate-800">Acceder con otro usuario / Cambiar cuenta</a>
          </div>
        </div>
      </div>
    )
  }

  return <AdminClient id={user.id} email={user.email ?? undefined} image={user.image ?? undefined} />
}
