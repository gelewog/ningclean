import 'package:equatable/equatable.dart';

class Service extends Equatable {
  final int id;
  final String name;
  final String description;
  final double price;
  final String unit;
  final String? imageUrl;
  final String category;
  final bool isActive;
  final DateTime? createdAt;

  const Service({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.unit,
    this.imageUrl,
    required this.category,
    this.isActive = true,
    this.createdAt,
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String,
      price: (json['price'] as num).toDouble(),
      unit: json['unit'] as String,
      imageUrl: json['image_url'] as String?,
      category: json['category'] as String,
      isActive: json['is_active'] as bool? ?? true,
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at'] as String) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'unit': unit,
      'image_url': imageUrl,
      'category': category,
      'is_active': isActive,
      'created_at': createdAt?.toIso8601String(),
    };
  }

  String get formattedPrice => 'Rp ${price.toStringAsFixed(0).replaceAllMapped(
    RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
    (Match m) => '${m[1]}.',
  )}';

  @override
  List<Object?> get props => [id, name, description, price, unit, imageUrl, category, isActive, createdAt];
}
