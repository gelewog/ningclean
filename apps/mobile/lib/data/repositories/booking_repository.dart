import 'package:dio/dio.dart';
import '../models/booking_model.dart';
import '../providers/api_provider.dart';
import '../../core/constants/api_constants.dart';

class BookingRepository {
  final ApiProvider _apiProvider;

  BookingRepository(this._apiProvider);

  Future<List<Booking>> getBookings({BookingStatus? status}) async {
    try {
      final response = await _apiProvider.get(
        ApiConstants.bookings,
        queryParameters: {
          if (status != null) 'status': status.name,
        },
      );
      
      final data = response.data as Map<String, dynamic>;
      final list = data['data'] as List<dynamic>;
      return list.map((json) => Booking.fromJson(json as Map<String, dynamic>)).toList();
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<Booking> getBookingById(int id) async {
    try {
      final response = await _apiProvider.get('${ApiConstants.bookingDetail}/$id');
      final data = response.data as Map<String, dynamic>;
      return Booking.fromJson(data);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<Booking> createBooking({
    required int serviceId,
    required DateTime scheduledDate,
    required String pickupAddress,
    String? deliveryAddress,
    String? notes,
  }) async {
    try {
      final response = await _apiProvider.post(
        ApiConstants.bookings,
        data: {
          'service_id': serviceId,
          'scheduled_date': scheduledDate.toIso8601String(),
          'pickup_address': pickupAddress,
          if (deliveryAddress != null) 'delivery_address': deliveryAddress,
          if (notes != null) 'notes': notes,
        },
      );
      
      final data = response.data as Map<String, dynamic>;
      return Booking.fromJson(data);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<void> cancelBooking(int id) async {
    try {
      await _apiProvider.post('${ApiConstants.bookingDetail}/$id/cancel');
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<Map<String, int>> getBookingStats() async {
    try {
      final response = await _apiProvider.get(ApiConstants.bookingStatus);
      final data = response.data as Map<String, dynamic>;
      return Map<String, int>.from(data['data'] as Map);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }
}
