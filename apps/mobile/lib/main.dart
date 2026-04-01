import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

import 'app/routes/app_router.dart';
import 'app/theme/app_theme.dart';
import 'app/bindings/initial_binding.dart';
import 'data/providers/api_provider.dart';
import 'data/repositories/auth_repository.dart';
import 'data/repositories/service_repository.dart';
import 'data/repositories/booking_repository.dart';

final getIt = GetIt.instance;

void setupDependencies() {
  // API Provider
  getIt.registerLazySingleton<ApiProvider>(() => ApiProvider());
  
  // Repositories
  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepository(getIt<ApiProvider>()),
  );
  getIt.registerLazySingleton<ServiceRepository>(
    () => ServiceRepository(getIt<ApiProvider>()),
  );
  getIt.registerLazySingleton<BookingRepository>(
    () => BookingRepository(getIt<ApiProvider>()),
  );
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  setupDependencies();
  runApp(const NingcleanApp());
}

class NingcleanApp extends StatelessWidget {
  const NingcleanApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Ningclean',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routerConfig: AppRouter.router,
    );
  }
}
