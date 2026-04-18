import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class NewsletterScheduler {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // Weekly cleaning tips
  private weeklyTips = [
    {
      title: '5 Tips Membersihkan Kamar Mandi',
      content: `
        <h2>🧹 5 Tips Membersihkan Kamar Mandi Dengan Mudah</h2>
        <p>Halo! Ini tips minggu ini dari NingClean 🏠</p>
        
        <ol>
          <li><strong>Kebersihan Toilet:</strong> Siram toilet dulu, lalu semprotkan cairan pembersih. Diamkan 10 menit sebelum disikat.</li>
          <li><strong>Kaca Cermin:</strong> Bersihkan dengan cuka putih yang dicampur air (1:1) agar kinclong tanpa noda.</li>
          <li><strong>Kecee Air:</strong> Semprotkan cuka ke lantai kamar mandi, diamkan 15 menit, lalu lap dengan mop.</li>
          <li><strong>Ventilasi:</strong> Nyalakan exhaust fan saat mandi untuk hindari jamur.</li>
          <li><strong>Grout Lines:</strong> Gunakan sikat gigi bekas untuk membersihkan nat ubin yang membandel.</li>
        </ol>
        
        <p>Butuh bantuan cleaning profesional? <a href="https://ningclean.id">Booking di sini</a> ✨</p>
      `,
    },
    {
      title: 'Tips Membersihkan Dapur',
      content: `
        <h2>🍳 Tips Membersihkan Dapur Supaya Kinclong</h2>
        <p>Halo! Ini tips minggu ini dari NingClean 🏠</p>
        
        <ol>
          <li><strong>Kompor:</strong> Semprotkan baking soda + air ke permukaan kompor. Diamkan 15 menit, lalu lap.</li>
          <li><strong>Exhaust Fan:</strong> Bersihkan filter exhaust setiap 2 minggu dengan air panas dan sabun pencuci piring.</li>
          <li><strong>Kulkas:</strong> Bersihkan bagian dalam setiap minggu. Buang makanan yang sudah expire.</li>
          <li><strong>Stool:</strong> Lap semua permukaan meja setelah masak dengan lap yang sudah dibasahi air hangat.</li>
          <li><strong>Peralatan:</strong> Cuci peralatan masak segera setelah dipakai.</li>
        </ol>
        
        <p>Butuh deep cleaning dapur? <a href="https://ningclean.id">Booking di sini</a> ✨</p>
      `,
    },
    {
      title: '5 Tips Membersihkan Ruang Tamu',
      content: `
        <h2>🛋️ 5 Tips Membersihkan Ruang Tamu</h2>
        <p>Halo! Ini tips minggu ini dari NingClean 🏠</p>
        
        <ol>
          <li><strong>Debu:</strong> Lap permukaan meja dengan microfiber cloth yang sudah dibasahi sedikit.</li>
          <li><strong>Sofa:</strong> Vakum sofa minimal 2x seminggu. Gunakan sisir upholstery untuk bersihkan celah.</li>
          <li><strong>Lantai:</strong> Sapu atau vakum lantai setiap hari. Pel dengan air hangat + sedikit deterjen.</li>
          <li><strong>Gorden:</strong> Buka jendela agar udara circulate. Bersihkan gorden dari debu setiap minggu.</li>
          <li><strong>Sudut Ruangan:</strong> Gunakan vacuum dengan nozzle kecil untuk sudut-sudut yang susah dijangkau.</li>
        </ol>
        
        <p>Butuh cleaning profesional? <a href="https://ningclean.id">Booking di sini</a> ✨</p>
      `,
    },
    {
      title: 'Tips Merawat Kasur Agar Tetap Bersih',
      content: `
        <h2>🛏️ Tips Merawat Kasur Agar Tetap Bersih & Higienis</h2>
        <p>Halo! Ini tips minggu ini dari NingClean 🏠</p>
        
        <ol>
          <li><strong>Vacuum Kasur:</strong> Vakum kasur setiap minggu untuk hilangkan debu dan sel kulit mati.</li>
          <li><strong>Matahari:</strong> Jemur kasur minimal sebulan sekali agar tidak lembap dan bau.</li>
          <li><strong>Spreader:</strong> Gunakan bed cover/protector untuk lindungi kasur dari noda dan keringat.</li>
          <li><strong>Rotasi:</strong> Balik kasur setiap bulan agar aus secara merata.</li>
          <li><strong>Noda:</strong> Kalau ada noda, bersihkan segera dengan campuran air + sedikit deterjen.</li>
        </ol>
        
        <p>Butuh deep cleaning kasur? <a href="https://ningclean.id">Booking di sini</a> ✨</p>
      `,
    },
  ];

  @Cron('0 9 * * SUN', { name: 'sendWeeklyNewsletter' })
  async sendWeeklyNewsletter() {
    console.log('[Newsletter] Starting weekly newsletter send...');

    try {
      // Get all active subscribers
      const subscribers = await this.prisma.newsletterSubscriber.findMany({
        where: { isActive: true },
        select: { email: true },
      });

      if (subscribers.length === 0) {
        console.log('[Newsletter] No active subscribers found');
        return;
      }

      // Select tip based on week number
      const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % this.weeklyTips.length;
      const tip = this.weeklyTips[weekNumber];

      const subject = `🧹 ${tip.title} - Tips Mingguan dari NingClean`;
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #10b981; margin: 0;">NingClean 🧹</h1>
            <p style="color: #666; margin: 5px 0;">Tips Kebersihan Setiap Minggu</p>
          </div>
          
          <div style="background: #f9fafb; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
            ${tip.content}
          </div>
          
          <div style="text-align: center; padding: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 5px 0;">
              Anda menerima email ini karena sudah berlangganan newsletter NingClean.
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0;">
              <a href="https://ningclean.id/unsubscribe" style="color: #10b981;">Berhenti berlangganan</a> • 
              <a href="https://ningclean.id" style="color: #10b981;">Website</a>
            </p>
          </div>
        </div>
      `;

      const result = await this.emailService.sendBulkEmails(subscribers, subject, htmlContent);
      console.log(`[Newsletter] Completed: ${result.sent} sent, ${result.failed} failed`);
    } catch (error) {
      console.error('[Newsletter] Error:', error);
    }
  }

  // Manual trigger for testing
  async sendWeeklyNewsletterNow() {
    return this.sendWeeklyNewsletter();
  }
}
