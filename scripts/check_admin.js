(async ()=>{
  const pkg = await import('@prisma/client')
  const PrismaClient = pkg.PrismaClient
  const prisma = new PrismaClient()
  try{
  const all = await prisma.user.findMany({ select: { id: true, name: true, email: true, isAdmin: true, createdAt: true, image: true } })
  console.log('USERS:')
  console.log(JSON.stringify(all, null, 2))
  } catch(e) {
    console.error('ERR:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})();
