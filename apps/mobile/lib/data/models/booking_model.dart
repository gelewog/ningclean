import 'package:equatable/equatable.dart';
import 'service_model.dart';

enum BookingStatus {
  pending,
  confirmed,
  inProgress,
  completed,
  cancelled;

  String get displayName {
    switch (this) {
      case BookingStatus.pending:
        return 'Menunggu';
      case BookingStatus.confirmed:
        return 'Dikonfirmasi';
      case BookingStatus.inProgress:
        return 'Sedang Diproses';
      case BookingStatus.completed:
        return 'Selesai';
      case BookingStatus.cancelled:
        return 'Dibatalkan';
    }
  }

  static BookingStatus fromString(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return BookingStatus.pending;
      case 'confirmed':
        return BookingStatus.confirmed;
      case 'in_progress':
      case 'inprogress':
        return BookingStatus.inProgress;
      case 'completed':
        return BookingStatus.completed;
      case 'cancelled':
        return BookingStatus.cancelled;
      default:
        return BookingStatus.pending;
    }
  }
}

class Booking extends Equatable {
  final int id;
  final String bookingNumber;
  final Service service;
  final BookingStatus status;
  final DateTime scheduledDate;
  final String pickupAddress;
  final String? deliveryAddress;
  final String? notes;
  final double totalAmount;
  final DateTime? completedAt;
  final DateTime createdAt;

  const Booking({
    required this.id,
    required this.bookingNumber,
    required this.service,
    required this.status,
    required this.scheduledDate,
    required this.pickupAddress,
    this.deliveryAddress,
    this.notes,
    required this.totalAmount,
    this.completedAt,
    required this.createdAt,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'] as int,
      bookingNumber: json['booking_number'] as String,
      service: Service.fromJson(json['service'] as Map<String, dynamic>),
      status: BookingStatus.fromString(json['status'] as String),
      scheduledDate: DateTime.parse(json['scheduled_date'] as String),
      pickupAddress: json['pickup_address'] as String,
      deliveryAddress: json['delivery_address'] as String?,
      notes: json['notes'] as String?,
      totalAmount: (json['total_amount'] as num).toDouble(),
      completedAt: json['completed_at'] != null 
          ? DateTime.parse(json['completed_at'] as String) 
          : null,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'booking_number': bookingNumber,
      'service': service.toJson(),
      'status': status.name,
      'scheduled_date': scheduledDate.toIso8601String(),
      'pickup_address': pickupAddress,
      'delivery_address': deliveryAddress,
      'notes': notes,
      'total_amount': totalAmount,
      'completed_at': completedAt?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }

  String get formattedTotal => 'Rp ${totalAmount.toStringAsFixed(0).replaceAllMapped(
    RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
    (Match m) => '${m[1]}.',
  )}';

  @override
  List<Object?> get props => [
    id, bookingNumber, service, status, scheduledDate,
    pickupAddress, deliveryAddress, notes, totalAmount,
    completedAt, createdAt,
  ];
}
