import 'package:equatable/equatable.dart';

class BlogPost extends Equatable {
  final int id;
  final String title;
  final String content;
  final String excerpt;
  final String? imageUrl;
  final String? authorName;
  final DateTime publishedAt;
  final int viewCount;
  final List<String> tags;

  const BlogPost({
    required this.id,
    required this.title,
    required this.content,
    required this.excerpt,
    this.imageUrl,
    this.authorName,
    required this.publishedAt,
    this.viewCount = 0,
    this.tags = const [],
  });

  factory BlogPost.fromJson(Map<String, dynamic> json) {
    return BlogPost(
      id: json['id'] as int,
      title: json['title'] as String,
      content: json['content'] as String,
      excerpt: json['excerpt'] as String,
      imageUrl: json['image_url'] as String?,
      authorName: json['author_name'] as String?,
      publishedAt: DateTime.parse(json['published_at'] as String),
      viewCount: json['view_count'] as int? ?? 0,
      tags: (json['tags'] as List<dynamic>?)?.cast<String>() ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'excerpt': excerpt,
      'image_url': imageUrl,
      'author_name': authorName,
      'published_at': publishedAt.toIso8601String(),
      'view_count': viewCount,
      'tags': tags,
    };
  }

  String get formattedDate {
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return '${publishedAt.day} ${months[publishedAt.month - 1]} ${publishedAt.year}';
  }

  @override
  List<Object?> get props => [
    id, title, content, excerpt, imageUrl, authorName,
    publishedAt, viewCount, tags,
  ];
}
