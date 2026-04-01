import 'package:dio/dio.dart';
import '../models/user_model.dart';
import '../providers/api_provider.dart';
import '../../core/constants/api_constants.dart';
import '../../core/constants/app_constants.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthRepository {
  final ApiProvider _apiProvider;

  AuthRepository(this._apiProvider);

  Future<User> login(String email, String password) async {
    try {
      final response = await _apiProvider.post(
        ApiConstants.login,
        data: {
          'email': email,
          'password': password,
        },
      );

      final data = response.data as Map<String, dynamic>;
      final token = data['token'] as String;
      
      // Save token
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConstants.tokenKey, token);
      _apiProvider.setAuthToken(token);

      return User.fromJson(data['user'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<User> register({
    required String name,
    required String email,
    required String password,
    String? phone,
  }) async {
    try {
      final response = await _apiProvider.post(
        ApiConstants.register,
        data: {
          'name': name,
          'email': email,
          'password': password,
          if (phone != null) 'phone': phone,
        },
      );

      final data = response.data as Map<String, dynamic>;
      final token = data['token'] as String;
      
      // Save token
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConstants.tokenKey, token);
      _apiProvider.setAuthToken(token);

      return User.fromJson(data['user'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<void> logout() async {
    try {
      await _apiProvider.post(ApiConstants.logout);
    } catch (_) {
      // Ignore logout API errors
    } finally {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(AppConstants.tokenKey);
      await prefs.remove(AppConstants.userKey);
      _apiProvider.setAuthToken(null);
    }
  }

  Future<User?> getProfile() async {
    try {
      final response = await _apiProvider.get(ApiConstants.profile);
      final data = response.data as Map<String, dynamic>;
      return User.fromJson(data);
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        return null;
      }
      throw ApiException.fromDioException(e);
    }
  }

  Future<User> updateProfile({
    String? name,
    String? phone,
    String? avatar,
  }) async {
    try {
      final response = await _apiProvider.put(
        ApiConstants.profile,
        data: {
          if (name != null) 'name': name,
          if (phone != null) 'phone': phone,
          if (avatar != null) 'avatar': avatar,
        },
      );
      final data = response.data as Map<String, dynamic>;
      return User.fromJson(data);
    } on DioException catch (e) {
      throw ApiException.fromDioException(e);
    }
  }

  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(AppConstants.tokenKey);
    if (token != null && token.isNotEmpty) {
      _apiProvider.setAuthToken(token);
      return true;
    }
    return false;
  }
}
