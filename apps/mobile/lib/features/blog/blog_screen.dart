import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_strings.dart';
import '../../core/constants/app_colors.dart';

class BlogScreen extends StatelessWidget {
  const BlogScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.blog),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // TODO: Refresh blog posts
          await Future.delayed(const Duration(seconds: 1));
        },
        child: ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: 10,
          itemBuilder: (context, index) {
            return _buildBlogCard(context, index);
          },
        ),
      ),
    );
  }

  Widget _buildBlogCard(BuildContext context, int index) {
    // Placeholder data - replace with actual data
    final titles = [
      'Tips Menabung untuk Gaji Pertama',
      'Cara Merawat Baju agar Tahan Lama',
      '5 Kesalahan Saat Mencuci Pakaian',
      'Panduan Hemat Listrik di Rumah',
      'Inspirasi Dekorasi Kamar Minimalis',
      'Resep Masakan Sehat untuk Keluarga',
      'Tips WFH Lebih Produktif',
      'Mengenal Bahan Kain dan Perawatannya',
      'Cara Menghilangkan Noda Membandel',
      'Trend Fashion 2026 yang Perlu Dicoba',
    ];

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () => context.push('/blog/${index + 1}'),
        borderRadius: BorderRadius.circular(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Placeholder
            Container(
              height: 180,
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
              ),
              child: Stack(
                children: [
                  Center(
                    child: Icon(
                      Icons.image,
                      size: 64,
                      color: AppColors.primary.withOpacity(0.3),
                    ),
                  ),
                  Positioned(
                    top: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'Tips',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Date & Author
                  Row(
                    children: [
                      const Icon(Icons.calendar_today, size: 14, color: AppColors.textLight),
                      const SizedBox(width: 4),
                      Text(
                        '30 Maret 2026',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(width: 16),
                      const Icon(Icons.person_outline, size: 14, color: AppColors.textLight),
                      const SizedBox(width: 4),
                      Text(
                        'Admin Ningclean',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Title
                  Text(
                    titles[index % titles.length],
                    style: Theme.of(context).textTheme.titleLarge,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  // Excerpt
                  Text(
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
                    style: Theme.of(context).textTheme.bodyMedium,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  // Read More
                  Row(
                    children: [
                      Text(
                        AppStrings.readMore,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(Icons.arrow_forward, size: 16, color: AppColors.primary),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
