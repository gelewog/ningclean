import 'package:go_router/go_router.dart';
import '../../features/home/home_screen.dart';
import '../../features/booking/booking_screen.dart';
import '../../features/booking/booking_detail_screen.dart';
import '../../features/booking/new_booking_screen.dart';
import '../../features/profile/profile_screen.dart';
import '../../features/blog/blog_screen.dart';
import '../../features/blog/blog_detail_screen.dart';
import '../bindings/main_binding.dart';

class AppRouter {
  static final _rootNavigatorKey = GlobalKey<NavigatorState>();
  static final _shellNavigatorKey = GlobalKey<NavigatorState>();

  static final router = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/home',
    routes: [
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) => MainBinding(child: child),
        routes: [
          GoRoute(
            path: '/home',
            name: 'home',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/bookings',
            name: 'bookings',
            builder: (context, state) => const BookingScreen(),
          ),
          GoRoute(
            path: '/profile',
            name: 'profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),
      GoRoute(
        path: '/booking/new',
        name: 'new-booking',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const NewBookingScreen(),
      ),
      GoRoute(
        path: '/booking/:id',
        name: 'booking-detail',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final id = int.parse(state.pathParameters['id']!);
          return BookingDetailScreen(bookingId: id);
        },
      ),
      GoRoute(
        path: '/blog',
        name: 'blog',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const BlogScreen(),
      ),
      GoRoute(
        path: '/blog/:id',
        name: 'blog-detail',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final id = int.parse(state.pathParameters['id']!);
          return BlogDetailScreen(postId: id);
        },
      ),
    ],
  );
}
