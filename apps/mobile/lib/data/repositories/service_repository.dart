import 'package:dio/dio.dart';
import '../models/service_model.dart';
import '../providers/api_provider.dart';
import '../../core/constants/api_constants.dart';

class ServiceRepository {
  final ApiProvider _apiProvider;

  ServiceRepository(this._apiProvider);

  Future<List<Service>> getServices({String? category}) async {
    try {
      final response = await _apiProvider.get(
        ApiConstants.services,
        queryParameters: {
          if (category != null) 'category': category,
        },
      );
      
      final data = response.data as Map<String, dynamic>;
      final list = data['data'] as List<dynamic>;
      return list.map((json) => Service.fromJson(json as Map<String, dynamic>)).toList();
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<Service> getServiceById(int id) async {
    try {
      final response = await _apiProvider.get('${ApiConstants.serviceDetail}/$id');
      final data = response.data as Map<String, dynamic>;
      return Service.fromJson(data);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<List<String>> getCategories() async {
    try {
      final response = await _apiProvider.get('${ApiConstants.services}/categories');
      final data = response.data as Map<String, dynamic>;
      final list = data['data'] as List<dynamic>;
      return list.cast<String>();
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }
}
