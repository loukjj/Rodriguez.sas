(async ()=>{
  const pkg = await import('@prisma/client')
  const bcryptModule = await import('bcryptjs')
  const bcrypt = bcryptModule.default || bcryptModule
  const PrismaClient = pkg.PrismaClient
  const prisma = new PrismaClient()
  try{
    const password = 'Str0ngP@ssw0rd!'
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name: 'Admin Real', email: 'admin.real@local.test', hashedPassword: hashed, isAdmin: true } })
    console.log('CREATED:')
  console.log(JSON.stringify({ id: user.id, email: user.email, isAdmin: (user.isAdmin === undefined ? true : user.isAdmin) }, null, 2))
    console.log('CREDENTIALS: email=admin.real@local.test password=Str0ngP@ssw0rd!')
  } catch(e) {
    console.error('ERR:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})();
