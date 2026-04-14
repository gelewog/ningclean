const axios = require('axios');

async function main() {
  try {
    // 1. Login
    console.log('🔐 Logging in...');
    const loginRes = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'admin@ningclean.com',
      password: 'admin123'
    });
    const token = loginRes.data.access_token;
    console.log('✅ Login successful');

    // 2. Create Team Member
    console.log('👤 Creating team member...');
    const memberRes = await axios.post('http://localhost:4000/api/team-members', {
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
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Team member created:');
    console.log(JSON.stringify(memberRes.data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

main();
