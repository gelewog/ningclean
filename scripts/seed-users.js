const { PrismaClient, Role } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('=== SEEDING USERS ===\n')

  // Sample users to seed
  const usersToSeed = [
    {
      email: 'admin@ningclean.com',
      name: 'Admin NingClean',
      phone: '081234567890',
      password: 'admin123',
      role: Role.ADMIN,
    },
    {
      email: 'manager@ningclean.com',
      name: 'Manager NingClean',
      phone: '081234567891',
      password: 'manager123',
      role: Role.STAFF,
    },
    {
      email: 'staff1@ningclean.com',
      name: 'Staff Satu',
      phone: '081234567892',
      password: 'staff123',
      role: Role.STAFF,
    },
    {
      email: 'staff2@ningclean.com',
      name: 'Staff Dua',
      phone: '081234567893',
      password: 'staff123',
      role: Role.STAFF,
    },
    {
      email: 'customer@example.com',
      name: 'John Doe',
      phone: '081234567894',
      password: 'customer123',
      role: Role.CUSTOMER,
    },
  ]

  for (const userData of usersToSeed) {
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (existing) {
      console.log(`✓ User already exists: ${userData.email} (${userData.role})`)
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          password: hashedPassword,
          role: userData.role,
        }
      })
      
      console.log(`✓ Created: ${user.name} (${user.email}) - ${user.role}`)
    }
  }

  console.log('\n=== SEEDING COMPLETE ===\n')

  // Show all users
  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true }
  })
  
  console.log('All users in database:')
  allUsers.forEach(u => console.log(`  - ${u.name} | ${u.email} | ${u.role}`))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
