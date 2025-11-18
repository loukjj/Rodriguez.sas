(async () => {
  const pkg = await import('@prisma/client')
  const bcryptModule = await import('bcryptjs')
  const bcrypt = bcryptModule.default || bcryptModule
  const PrismaClient = pkg.PrismaClient
  const prisma = new PrismaClient()

  const email = 'admin.real@local.test'
  const password = 'Str0ngP@ssw0rd!'

  try {
    let user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true, isAdmin: true, hashedPassword: true } })

    if (!user) {
      const hashed = await bcrypt.hash(password, 10)
      user = await prisma.user.create({ data: { name: 'Admin Real', email, hashedPassword: hashed, isAdmin: true } })
      console.log('Admin creado:', { id: user.id, email: user.email, isAdmin: user.isAdmin })
    } else {
      const updates = {}
      if (!user.hashedPassword || user.hashedPassword.length < 20) {
        // Reestablecer/crear hash si falta o parece inválido
        // @ts-ignore
        updates.hashedPassword = await bcrypt.hash(password, 10)
      }
      if (!user.isAdmin) {
        // @ts-ignore
        updates.isAdmin = true
      }

      if (Object.keys(updates).length > 0) {
        await prisma.user.update({ where: { email }, data: updates })
        console.log('Admin actualizado:', Object.keys(updates))
      } else {
        console.log('Admin ya correcto (sin cambios)')
      }
    }

    const finalUser = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true, isAdmin: true, hashedPassword: true } })
    console.log('Estado final admin:', { id: finalUser?.id, email: finalUser?.email, isAdmin: finalUser?.isAdmin, hashedPassword: finalUser?.hashedPassword ? `presente,len=${finalUser?.hashedPassword.length}` : 'faltante' })
    console.log('Credenciales válidas -> email=admin.real@local.test password=Str0ngP@ssw0rd!')
  } catch (e) {
    console.error('Error en ensure_admin:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
