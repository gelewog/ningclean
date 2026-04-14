const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const member = await prisma.teamMember.create({
    data: {
      name: 'Rina Susanti',
      position: 'Cleaning Supervisor',
      department: 'Operations',
      bio: 'Berpengalaman 5 tahun di industri cleaning service. Teliti dan detail-oriented. Spesialis deep cleaning dan organizer.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina',
      email: 'rina@ningclean.com',
      phone: '081234567890',
      isActive: true,
      order: 2,
      socialLinks: {
        instagram: 'https://instagram.com/rina.susanti',
        whatsapp: 'https://wa.me/6281234567890'
      }
    }
  });
  console.log('✅ Member created:', JSON.stringify(member, null, 2));
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Error:', e);
    prisma.$disconnect();
    process.exit(1);
  });
