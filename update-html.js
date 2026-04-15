const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const htmlContent = `<p>Kebersihan rumah itu nggak harus ribet. Cukup lakukan 5 hal sederhana ini setiap hari, dan rumahmu akan selalu terasa nyaman:</p>

<h2>1. Buang Sampah Sebelum Tidur</h2>
<p>Jangan biarkan sampah menumpuk di malam hari. Buang sebelum tidur biar pagi bangun udah fresh.</p>

<h2>2. Lap Meja Makan Setelah Makan</h2>
<p>Habiskan 2 menit buat lap meja makan. Noda yang dibiarkan bakal makin susah dibersihin.</p>

<h2>3. Ranjang yang Rapi</h2>
<p>Ranjang yang dirapikan pagi-pagi bikin kamar terlihat lebih bersih seketika. Plus, mood langsung naik!</p>

<h2>4. Cucian Harian</h2>
<p>Kalau ada cucian, langsung cuci atau setidaknya rendam. Jangan ditumpuk-tumpuk.</p>

<h2>5. Ventilasi yang Cukup</h2>
<p>Buka jendela minimal 15 menit sehari. Udara segar = rumah yang sehat.</p>

<p><strong>Kesimpulan:</strong> Konsistensi itu kunci. Lakukan hal-hal kecil setiap hari, dan nggak perlu deep cleaning besar-besaran setiap minggu.</p>`;

async function update() {
  const updated = await prisma.blogPost.update({
    where: { slug: '5-tips-sederhana-menjaga-kebersihan-rumah' },
    data: { content: htmlContent }
  });
  console.log('✅ Updated:', updated.title);
  await prisma.$disconnect();
}

update().catch(err => {
  console.error('❌ Error:', err.message);
  prisma.$disconnect();
});
