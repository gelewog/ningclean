const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const newContent = `<div class="not-prose blog-article-content" style="color: inherit;">
  <style>
    .blog-article-content { color: #334155; }
    .dark .blog-article-content { color: #cbd5e1; }
    .blog-article-content h2, .blog-article-content h3, .blog-article-content h4 { color: #0f172a; margin-top: 0; }
    .dark .blog-article-content h2, .dark .blog-article-content h3, .dark .blog-article-content h4 { color: #f8fafc; }
    .blog-article-content strong { color: #0f172a; }
    .dark .blog-article-content strong { color: #f8fafc; }
    .blog-article-content em { color: #1e293b; }
    .dark .blog-article-content em { color: #e2e8f0; }
  </style>

  <!-- Intro -->
  <div class="bg-slate-50 dark:bg-slate-800 border-l-4 border-emerald-500 p-6 mb-8 rounded-r-xl">
    <p class="text-lg leading-relaxed m-0">
      <strong>Kebersihan rumah bukan cuma soal menyapu dan mengepel.</strong> Dengan rutinitas sederhana yang konsisten, kamu bisa menjaga rumah tetap nyaman tanpa perlu <em>deep cleaning</em> besar-besaran setiap minggu. Artikel ini akan membimbingmu langkah demi langkah dengan checklist interaktif yang bisa kamu ikuti setiap hari!
    </p>
  </div>

  <!-- Progress Tracker -->
  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-8">
    <h3 class="mb-4 text-xl font-semibold">📊 Progress Tracker Harianmu</h3>
    <p class="text-slate-600 dark:text-slate-400 mb-4">Centang setiap tugas yang sudah kamu selesaikan hari ini:</p>
    <div class="bg-slate-200 dark:bg-slate-700 h-5 rounded-full overflow-hidden mb-4">
      <div id="progress-fill" class="bg-emerald-500 h-full transition-all duration-500 flex items-center justify-center text-white text-xs font-bold" style="width: 0%;">0%</div>
    </div>
    <p class="text-center text-slate-600 dark:text-slate-400 text-sm"><span id="completed-count" class="font-semibold">0</span> dari 5 tugas selesai ✅</p>
  </div>

  <!-- Tip 1 -->
  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-6">
    <div class="flex items-center mb-6">
      <div class="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-bold mr-4 flex-shrink-0">1</div>
      <div>
        <h2 class="text-2xl font-semibold">Buang Sampah Sebelum Tidur 🗑️</h2>
        <span class="text-emerald-600 dark:text-emerald-400 text-sm">⏱️ Waktu: 3-5 menit</span>
      </div>
    </div>
    
    <div class="leading-relaxed">
      <p><strong>Mengapa ini penting:</strong> Sampah yang dibiarkan semalaman bisa menarik serangga, menciptakan bau tidak sedap, dan membuat suasana pagi jadi tidak nyaman. Plus, memulai hari dengan rumah bebas sampah memberikan energi positif!</p>
      
      <div class="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-5 my-5">
        <h4 class="mb-4 font-semibold">✅ Checklist Malam Hari:</h4>
        <ul class="list-none p-0 m-0 space-y-3">
          <li class="flex items-center"><input type="checkbox" class="mr-3 w-5 h-5 accent-emerald-500 rounded"> Kosongkan tempat sampah di dapur</li>
          <li class="flex items-center"><input type="checkbox" class="mr-3 w-5 h-5 accent-emerald-500 rounded"> Buang sampah dari kamar tidur</li>
          <li class="flex items-center"><input type="checkbox" class="mr-3 w-5 h-5 accent-emerald-500 rounded"> Pastikan tidak ada sisa makanan di meja</li>
          <li class="flex items-center"><input type="checkbox" class="mr-3 w-5 h-5 accent-emerald-500 rounded"> Ganti kantong sampah dengan yang baru</li>
        </ul>
      </div>

      <div class="bg-emerald-50 dark:bg-emerald-900/50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
        <strong class="text-emerald-800 dark:text-emerald-300">💡 Pro Tip:</strong> <span>Siapkan tempat sampah kecil di setiap kamar dan ruang utama. Ini memudahkanmu untuk langsung membuang sampah tanpa harus jalan jauh ke tempat sampah besar.</span>
      </div>
    </div>
  </div>

  <!-- Tip 2 -->
  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-6">
    <div class="flex items-center mb-6">
      <div class="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center text-2xl font-bold mr-4 flex-shrink-0">2</div>
      <div>
        <h2 class="text-2xl font-semibold">Lap Meja Makan Setelah Makan 🍽️</h2>
        <span class="text-emerald-600 dark:text-emerald-400 text-sm">⏱️ Waktu: 2 menit</span>
      </div>
    </div>
    
    <div class="leading-relaxed">
      <p><strong>Mengapa ini penting:</strong> Noda makanan yang dibiarkan mengering akan menjadi tempat berkembang biak bakteri dan lebih sulit dibersihkan nantinya. Meja yang bersih juga membuat suasana makan selanjutnya lebih menyenangkan.</p>
      
      <div class="bg-sky-50 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-800 rounded-xl p-5 my-5">
        <h4 class="mb-4 font-semibold">🔄 Langkah-langkah Cepat:</h4>
        <ol class="m-0 pl-6 leading-8">
          <li>Ambil piring dan gelas bekas ke wastafel</li>
          <li>Singkirkan sisa makanan ke tempat sampah</li>
          <li>Sapukan meja dengan kain lap bersih (basah atau kering)</li>
          <li>Pastikan tidak ada noda lengket tersisa</li>
          <li>Letakkan kembali peralatan makan yang perlu disimpan</li>
        </ol>
      </div>

      <div class="bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 rounded-xl p-4">
        <strong class="text-sky-800 dark:text-sky-300">🧽 Rekomendasi:</strong> Gunakan lap mikrofiber untuk hasil terbaik. Lap ini lebih efektif menangkap debu dan noda tanpa meninggalkan serat.
      </div>
    </div>
  </div>

  <!-- Tip 3 -->
  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-6">
    <div class="flex items-center mb-6">
      <div class="w-12 h-12 rounded-full bg-violet-500 text-white flex items-center justify-center text-2xl font-bold mr-4 flex-shrink-0">3</div>
      <div>
        <h2 class="text-2xl font-semibold">Ranjang yang Rapi Setiap Pagi 🛏️</h2>
        <span class="text-emerald-600 dark:text-emerald-400 text-sm">⏱️ Waktu: 2-3 menit</span>
      </div>
    </div>
    
    <div class="leading-relaxed">
      <p><strong>Mengapa ini penting:</strong> Ada filosofi yang bilang <em>"buat ranjangmu setiap pagi dan kamu sudah menyelesaikan tugas pertama hari ini"</em>. Ranjang yang rapi memberikan rasa pencapaian, membuat kamar terlihat lebih bersih secara instan, dan membentuk disiplin yang berpengaruh ke aktivitas lainnya.</p>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
        <div class="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 p-5 rounded-xl text-center">
          <div class="text-3xl mb-2">🧠</div>
          <strong class="block mb-1">Mood Booster</strong>
          <span class="text-slate-600 dark:text-slate-400 text-sm">Mulai hari dengan rasa berhasil</span>
        </div>
        <div class="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 p-5 rounded-xl text-center">
          <div class="text-3xl mb-2">🦟</div>
          <strong class="block mb-1">Anti Debu</strong>
          <span class="text-slate-600 dark:text-slate-400 text-sm">Kurangi tempat berkumpul debu</span>
        </div>
        <div class="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 p-5 rounded-xl text-center">
          <div class="text-3xl mb-2">😴</div>
          <strong class="block mb-1">Tidur Nyenyak</strong>
          <span class="text-slate-600 dark:text-slate-400 text-sm">Kembali ke ranjang yang nyaman</span>
        </div>
      </div>

      <div class="bg-violet-50 dark:bg-violet-900/50 border border-violet-200 dark:border-violet-800 rounded-xl p-5">
        <h4 class="mb-4 font-semibold">✨ Cara Membuat Ranjang dengan Cepat:</h4>
        <ol class="m-0 pl-6 leading-8">
          <li><strong>Lepaskan selimut</strong> - angkat dan letakkan di kursi atau sudut ranjang</li>
          <li><strong>Ratakan seprai</strong> - tarik sudut-sudut seprai agar rata tanpa kerutan</li>
          <li><strong>Kembalikan bantal</strong> - letakkan bantal dengan rapi di kepala ranjang</li>
          <li><strong>Lipat selimut</strong> - lipat dengan rapi atau tarik hingga menutupi ranjang dengan sempurna</li>
          <li><strong>Tambahkan sentuhan</strong> - letakkan bantal hias atau guling jika ada</li>
        </ol>
      </div>
    </div>
  </div>

  <!-- Tip 4 -->
  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-6">
    <div class="flex items-center mb-6">
      <div class="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center text-2xl font-bold mr-4 flex-shrink-0">4</div>
      <div>
        <h2 class="text-2xl font-semibold">Cucian Harian: Jangan Ditumpuk! 👕</h2>
        <span class="text-emerald-600 dark:text-emerald-400 text-sm">⏱️ Waktu: 10-15 menit (bisa sambil multitasking)</span>
      </div>
    </div>
    
    <div class="leading-relaxed">
      <p><strong>Mengapa ini penting:</strong> Tumpukan cucian yang menumpuk menciptakan beban mental dan membuat kamu harus menghabiskan waktu berjam-jam di akhir pekan. Sistem cucian harian mencegah "gunung cucian" yang menakutkan itu.</p>
      
      <div class="bg-sky-50 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-800 rounded-xl p-5 my-5 overflow-x-auto">
        <h4 class="mb-4 font-semibold">📅 Sistem Cucian Harian yang Efektif:</h4>
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="bg-sky-100 dark:bg-sky-800">
              <th class="text-left p-3 font-semibold border-b-2 border-sky-300 dark:border-sky-700">Waktu</th>
              <th class="text-left p-3 font-semibold border-b-2 border-sky-300 dark:border-sky-700">Aktivitas</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-3 font-semibold">Pagi (07:00)</td>
              <td class="p-3">Cek keranjang cucian - kalau penuh, langsung masukkan ke mesin</td>
            </tr>
            <tr class="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <td class="p-3 font-semibold">Siang (12:00)</td>
              <td class="p-3">Pindahkan ke dryer atau jemur (sambil makan siang)</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-3 font-semibold">Sore (16:00)</td>
              <td class="p-3">Lipat dan simpan cucian yang sudah kering</td>
            </tr>
            <tr class="bg-slate-50 dark:bg-slate-700/50">
              <td class="p-3 font-semibold">Malam (20:00)</td>
              <td class="p-3">Kumpulkan pakaian kotor hari itu di keranjang</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <strong class="text-red-800 dark:text-red-300">⚠️ Hindari Kebiasaan Ini:</strong> <span class="text-red-700 dark:text-red-200">Menunda cucian sampai akhir pekan bisa membuat pakaian berbau apek dan meningkatkan beban kerja. Lakukan sedikit-sedikit setiap hari!</span>
      </div>
    </div>
  </div>

  <!-- Tip 5 -->
  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-6">
    <div class="flex items-center mb-6">
      <div class="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center text-2xl font-bold mr-4 flex-shrink-0">5</div>
      <div>
        <h2 class="text-2xl font-semibold">Ventilasi yang Cukup Setiap Hari 🌬️</h2>
        <span class="text-emerald-600 dark:text-emerald-400 text-sm">⏱️ Waktu: 15-30 menit</span>
      </div>
    </div>
    
    <div class="leading-relaxed">
      <p><strong>Mengapa ini penting:</strong> Udara yang segar mengurangi kelembaban, mencegah pertumbuhan jamur, mengusir bau tak sedap, dan menciptakan lingkungan yang lebih sehat untuk pernapasan. Rumah yang berventilasi baik terasa lebih nyaman dan energik.</p>
      
      <div class="bg-green-50 dark:bg-green-900/50 border-2 border-green-300 dark:border-green-800 rounded-xl p-5 my-5">
        <h4 class="mb-4 text-green-900 dark:text-green-300 font-semibold">🌅 Waktu Terbaik untuk Ventilasi:</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-white dark:bg-slate-900 border border-green-300 dark:border-green-800 p-5 rounded-xl text-center">
            <div class="text-3xl mb-2">🌄</div>
            <strong class="block mb-1">Pagi (07:00-09:00)</strong>
            <span class="text-slate-600 dark:text-slate-400 text-sm">Udara segar, suhu sejuk</span>
          </div>
          <div class="bg-white dark:bg-slate-900 border border-green-300 dark:border-green-800 p-5 rounded-xl text-center">
            <div class="text-3xl mb-2">🌇</div>
            <strong class="block mb-1">Sore (16:00-18:00)</strong>
            <span class="text-slate-600 dark:text-slate-400 text-sm">Suhu turun, angin sepoi</span>
          </div>
        </div>
      </div>

      <div class="bg-yellow-50 dark:bg-yellow-900/50 border-l-4 border-yellow-500 dark:border-yellow-400 p-4 rounded-r-lg">
        <strong class="text-yellow-800 dark:text-yellow-300">💨 Tips Ventilasi Maksimal:</strong>
        <ul class="mt-2 pl-5 leading-7">
          <li>Buka jendela di sisi berlawanan untuk membuat <em>cross ventilation</em></li>
          <li>Matikan AC selama ventilasi agar udara segar masuk optimal</li>
          <li>Gunakan kipas angin untuk membantu sirkulasi jika perlu</li>
          <li>Jika ada exhaust fan di dapur/kamar mandi, nyalakan selama 15 menit</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Interactive Summary -->
  <div class="bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-600 dark:to-emerald-800 rounded-2xl p-8 my-8 text-center text-white">
    <h2 class="mb-4 text-2xl font-bold text-white">🎯 Ringkasan Rutinitas Harian</h2>
    <p class="text-lg mb-6">Total waktu yang dibutuhkan: <strong>hanya 30-45 menit per hari</strong></p>
    
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      <div class="bg-white/20 p-4 rounded-xl">
        <div class="text-3xl mb-1">🗑️</div>
        <strong class="text-sm text-white">Buang Sampah</strong><br>
        <small class="text-white/90">Malam hari</small>
      </div>
      <div class="bg-white/20 p-4 rounded-xl">
        <div class="text-3xl mb-1">🍽️</div>
        <strong class="text-sm text-white">Bersihkan Meja</strong><br>
        <small class="text-white/90">Setelah makan</small>
      </div>
      <div class="bg-white/20 p-4 rounded-xl">
        <div class="text-3xl mb-1">🛏️</div>
        <strong class="text-sm text-white">Rapikan Ranjang</strong><br>
        <small class="text-white/90">Pagi hari</small>
      </div>
      <div class="bg-white/20 p-4 rounded-xl">
        <div class="text-3xl mb-1">👕</div>
        <strong class="text-sm text-white">Cucian Harian</strong><br>
        <small class="text-white/90">Sesuai jadwal</small>
      </div>
      <div class="bg-white/20 p-4 rounded-xl">
        <div class="text-3xl mb-1">🌬️</div>
        <strong class="text-sm text-white">Ventilasi</strong><br>
        <small class="text-white/90">Pagi & Sore</small>
      </div>
    </div>
  </div>

  <!-- Bonus Section -->
  <div class="bg-white dark:bg-slate-800 border-2 border-dashed border-violet-400 dark:border-violet-600 rounded-2xl p-8 mb-8">
    <h2 class="mb-6 text-violet-700 dark:text-violet-300 text-center text-2xl font-semibold">🎁 Bonus: 5 Tips Tambahan!</h2>
    <div class="space-y-4">
      <div class="bg-violet-50 dark:bg-violet-900/50 border-l-4 border-violet-500 dark:border-violet-400 p-4 rounded-r-lg">
        <strong>🧹 1. Sapukan Cepat:</strong> Sapukan lantai area lalu lintas tinggi setiap 2 hari sekali untuk mencegah debu menumpuk.
      </div>
      <div class="bg-violet-50 dark:bg-violet-900/50 border-l-4 border-violet-500 dark:border-violet-400 p-4 rounded-r-lg">
        <strong>🪞 2. Cermin Bersih:</strong> Lap cermin kamar mandi dengan koran bekas setelah mandi - mencegah noda kapur air.
      </div>
      <div class="bg-violet-50 dark:bg-violet-900/50 border-l-4 border-violet-500 dark:border-violet-400 p-4 rounded-r-lg">
        <strong>🌿 3. Tanaman Penyegar:</strong> Letakkan tanaman indoor seperti lidah mertua atau peace lily - alami penyaring udara.
      </div>
      <div class="bg-violet-50 dark:bg-violet-900/50 border-l-4 border-violet-500 dark:border-violet-400 p-4 rounded-r-lg">
        <strong>🗄️ 4. One-Touch Rule:</strong> Jika kamu memegang sesuatu, selesaikan segera - jangan taruh untuk nanti.
      </div>
      <div class="bg-violet-50 dark:bg-violet-900/50 border-l-4 border-violet-500 dark:border-violet-400 p-4 rounded-r-lg">
        <strong>📱 5. Timer Challenge:</strong> Mainkan musik 10 menit dan lihat berapa banyak yang bisa kamu bersihkan - bikin jadi seru!
      </div>
    </div>
  </div>

  <!-- Conclusion -->
  <div class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-8 text-center">
    <h2 class="mb-4 text-2xl font-semibold">✨ Kesimpulan</h2>
    <p class="text-lg leading-relaxed">
      <strong>Konsistensi adalah kunci.</strong> Rutinitas sederhana yang dilakukan setiap hari jauh lebih efektif daripada deep cleaning besar-besaran sesekali. Mulai dari hal kecil, jadikan kebiasaan, dan nikmati rumah yang selalu nyaman dan sehat setiap hari!
    </p>
    <div class="inline-block mt-6 p-5 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-xl">
      <strong class="text-green-800 dark:text-green-300 text-lg">🏆 Challenge: Coba lakukan 5 tips ini selama 7 hari berturut-turut!</strong><br>
      <span class="text-slate-600 dark:text-slate-400">Rasakan perbedaannya dan bagikan pengalamanmu.</span>
    </div>
  </div>

  <!-- CTA Section -->
  <div class="text-center p-8 bg-gradient-to-br from-sky-500 to-sky-700 dark:from-sky-600 dark:to-sky-800 rounded-2xl text-white">
    <h3 class="mb-4 text-xl font-semibold text-white">💚 Butuh Bantuan Professional?</h3>
    <p class="text-lg mb-6">NingClean siap membantu membersihkan rumahmu dengan tim professional dan peralatan lengkap.</p>
    <a href="/booking" class="inline-block bg-white text-sky-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-shadow no-underline">
      📅 Booking Layanan Sekarang
    </a>
  </div>

  <!-- Tags -->
  <div class="mt-8 pt-5 border-t border-slate-200 dark:border-slate-700">
    <span class="text-slate-500 dark:text-slate-400 text-sm">📌 Tags: </span>
    <span class="inline-block bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-1 rounded-full m-1 text-sm">tips kebersihan</span>
    <span class="inline-block bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-1 rounded-full m-1 text-sm">rumah bersih</span>
    <span class="inline-block bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-1 rounded-full m-1 text-sm">daily routine</span>
    <span class="inline-block bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-1 rounded-full m-1 text-sm">home care</span>
    <span class="inline-block bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-1 rounded-full m-1 text-sm">life hacks</span>
  </div>
</div>

<script>
(function() {
  const checkboxes = document.querySelectorAll('.blog-article-content input[type="checkbox"]');
  const progressFill = document.getElementById('progress-fill');
  const completedCount = document.getElementById('completed-count');
  
  function updateProgress() {
    const checked = document.querySelectorAll('.blog-article-content input[type="checkbox"]:checked').length;
    const total = checkboxes.length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    if (progressFill) {
      progressFill.style.width = percentage + '%';
      progressFill.textContent = percentage + '%';
    }
    if (completedCount) {
      completedCount.textContent = checked;
    }
  }
  
  checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', updateProgress);
  });
})();
</script>`;

async function updatePost() {
  try {
    const updated = await prisma.blogPost.update({
      where: {
        id: '01b9b1ab-a068-4698-aeff-d0879c0459ff'
      },
      data: {
        content: newContent,
        readTime: 8,
        updatedAt: new Date()
      }
    });
    console.log('✅ Artikel berhasil diupdate!');
    console.log('ID:', updated.id);
    console.log('Title:', updated.title);
    console.log('Updated at:', updated.updatedAt);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

updatePost();
