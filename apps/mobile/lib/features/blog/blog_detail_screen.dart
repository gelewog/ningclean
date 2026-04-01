import 'package:flutter/material.dart';
import '../../core/constants/app_strings.dart';
import '../../core/constants/app_colors.dart';

class BlogDetailScreen extends StatelessWidget {
  final int postId;

  const BlogDetailScreen({super.key, required this.postId});

  @override
  Widget build(BuildContext context) {
    // TODO: Load blog post data from repository/BLoC
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App Bar with Image
          SliverAppBar(
            expandedHeight: 250,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                color: AppColors.primary.withOpacity(0.1),
                child: Center(
                  child: Icon(
                    Icons.image,
                    size: 80,
                    color: AppColors.primary.withOpacity(0.3),
                  ),
                ),
              ),
            ),
          ),
          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Category Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'Tips & Tricks',
                      style: TextStyle(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Title
                  Text(
                    'Tips Menabung untuk Gaji Pertama',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Meta Info
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 16,
                        backgroundColor: AppColors.primary.withOpacity(0.1),
                        child: const Icon(Icons.person, size: 18, color: AppColors.primary),
                      ),
                      const SizedBox(width: 8),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Admin Ningclean',
                            style: Theme.of(context).textTheme.titleSmall,
                          ),
                          Text(
                            '30 Maret 2026 · 5 min read',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  
                  // Article Content
                  _buildArticleContent(context),
                  
                  const SizedBox(height: 24),
                  
                  // Tags
                  Wrap(
                    spacing: 8,
                    children: [
                      _buildTag(context, 'Laundry'),
                      _buildTag(context, 'Tips'),
                      _buildTag(context, 'Hemat'),
                    ],
                  ),
                  const SizedBox(height: 24),
                  
                  // Share & Like
                  Row(
                    children: [
                      OutlinedButton.icon(
                        onPressed: () {
                          // TODO: Share post
                        },
                        icon: const Icon(Icons.share_outlined),
                        label: const Text('Bagikan'),
                      ),
                      const SizedBox(width: 12),
                      OutlinedButton.icon(
                        onPressed: () {
                          // TODO: Like post
                        },
                        icon: const Icon(Icons.favorite_border),
                        label: const Text('Suka'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildArticleContent(BuildContext context) {
    return Text(
      '''Memulai perjalanan keuangan yang baik memang tidak mudah, terutama jika ini adalah gaji pertama kamu. Namun, dengan perencanaan yang tepat, kamu bisa mulai menabung dan membangun kebiasaan finansial yang sehat.

Berikut adalah beberapa tips yang bisa kamu terapkan:

1. **Tentukan Persentase Menabung**
   Sebagai aturan umum, coba sisihkan minimal 20% dari gaji kamu untuk ditabung. Jika memungkinkan, tingkatkan menjadi 30% atau lebih.

2. **Buat Anggaran Bulanan**
   Catat semua pengeluaranmu selama sebulan. Dari sini, kamu bisa melihat mana yang perlu dikurangi dan mana yang penting.

3. **Bedakan Kebutuhan dan Keinginan**
   Sebelum membeli sesuatu, tanyakan pada diri sendiri: apakah ini kebutuhan atau hanya keinginan? Ini membantu kamu lebih bijak dalam spending.

4. **Manfaatkan Aplikasi Tabungan**
   Saat ini sudah banyak aplikasi yang bisa membantu kamu menabung secara otomatis. Manfaatkan fitur auto-debit untuk kemudahan.

5. **Hindari Utang Konsumtif**
   Utang untuk hal-hal konsumtif seperti gadgets atau fashion baru sebaiknya dihindari. Utang hanya untuk investasi atau hal yang benar-benar produktif.

Dengan menerapkan tips-tips di atas secara konsisten, kamu akan melihat progress yang signifikan dalam tabunganmu dalam beberapa bulan ke depan. Selamat mencoba!''',
      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
        height: 1.8,
      ),
    );
  }

  Widget _buildTag(BuildContext context, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.border,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(
        '#$label',
        style: Theme.of(context).textTheme.bodySmall,
      ),
    );
  }
}
