// scripts/check-column.js
// Comprueba si la columna `hashedPassword` existe en la tabla "User" usando Prisma Client.
// Soporta Postgres (information_schema) y SQLite (PRAGMA table_info).
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const dbUrl = process.env.DATABASE_URL || ''
  let res
  if (dbUrl.startsWith('file:') || dbUrl.includes('sqlite')) {
    // SQLite: usar PRAGMA
    res = await prisma.$queryRawUnsafe(`PRAGMA table_info('User');`)
    // PRAGMA devuelve rows with a 'name' column
    const has = res.some(r => r.name === 'hashedPassword')
    console.log('SQLite - columna hashedPassword existe?:', has)
    if (has) console.log('Detalle PRAGMA:', res.filter(r => r.name === 'hashedPassword'))
  } else {
    // Postgres: information_schema
    res = await prisma.$queryRawUnsafe(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = '"User"' AND column_name = 'hashedPassword';
    `)
    console.log('Postgres - Resultado:', res)
  }
}

main()
  .catch(e => { console.error(e); process.exitCode = 1 })
  .finally(() => prisma.$disconnect())
