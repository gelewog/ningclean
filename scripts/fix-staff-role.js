const { PrismaClient, Role } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function fix() {
  const users = await prisma.user.findMany({ where: { role: 'ADMIN' } })
  for (const u of users) {
    if (u.email.includes('manager')) {
      await prisma.user.update({ where: { id: u.id }, data: { role: Role.STAFF } })
      console.log('Updated', u.email, 'to STAFF')
    } else if (u.email.includes('staff')) {
      await prisma.user.update({ where: { id: u.id }, data: { role: Role.STAFF } })
      console.log('Updated', u.email, 'to STAFF')
    }
  }
  const all = await prisma.user.findMany({ select: { name: true, email: true, role: true } })
  console.log('\nAll users:')
  all.forEach(u => console.log('  ', u.name, '|', u.email, '|', u.role))
  prisma.$disconnect()
}
fix()
