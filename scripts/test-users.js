const { PrismaClient, Role } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function test() {
  const token = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ningclean.com', password: 'admin123' })
  }).then(r => r.json())
  console.log('Token:', token.access_token ? 'OK' : 'FAIL')
  
  const users = await fetch('http://localhost:4000/api/admin/users', {
    headers: { 'Authorization': 'Bearer ' + token.access_token }
  }).then(r => r.json())
  console.log('Users count:', users.length)
  users.forEach(u => console.log('  -', u.name, '|', u.role))
  
  await prisma.$disconnect()
}
test()
