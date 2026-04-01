class ApiConstants {
  // Base URL - change this to your actual API URL
  static const String baseUrl = 'https://api.ningclean.com';
  
  // API Version
  static const String apiVersion = '/api/v1';
  
  // Full API Base
  static const String apiBase = '$baseUrl$apiVersion';
  
  // Endpoints
  static const String login = '$apiBase/auth/login';
  static const String register = '$apiBase/auth/register';
  static const String logout = '$apiBase/auth/logout';
  static const String profile = '$apiBase/profile';
  
  static const String services = '$apiBase/services';
  static const String serviceDetail = '$apiBase/services'; // + /{id}
  
  static const String bookings = '$apiBase/bookings';
  static const String bookingDetail = '$apiBase/bookings'; // + /{id}
  static const String bookingStatus = '$apiBase/bookings/status';
  
  static const String blogPosts = '$apiBase/blog/posts';
  static const String blogPostDetail = '$apiBase/blog/posts'; // + /{id}
  
  // Timeouts
  static const int connectTimeout = 30000; // 30 seconds
  static const int receiveTimeout = 30000; // 30 seconds
}
