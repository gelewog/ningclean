# Ningclean Mobile App

Aplikasi mobile untuk layanan laundry dan cleaning terpercaya.

## 📋 Prerequisites

- Flutter SDK 3.0.0 atau lebih tinggi
- Dart SDK 3.0.0 atau lebih tinggi
- Android Studio / VS Code dengan Flutter extension
- Emulator Android atau device fisik

## 🚀 Installation

1. **Clone repository dan navigasi ke folder mobile:**
```bash
cd apps/mobile
```

2. **Install dependencies:**
```bash
flutter pub get
```

3. **Jalankan aplikasi:**
```bash
# Development
flutter run

# Release (Android)
flutter build apk --release
```

## 📁 Project Structure

```
apps/mobile/
├── lib/
│   ├── main.dart                 # Entry point
│   ├── app/
│   │   ├── routes/              # Navigation (GoRouter)
│   │   ├── theme/               # App theme & colors
│   │   └── bindings/            # Dependency injection bindings
│   ├── core/
│   │   ├── constants/            # API, App constants, Strings
│   │   ├── utils/               # Helper utilities
│   │   └── widgets/             # Shared widgets
│   ├── data/
│   │   ├── models/              # Data models (User, Service, Booking, BlogPost)
│   │   ├── providers/           # API provider (Dio client)
│   │   └── repositories/        # Data repositories
│   └── features/
│       ├── home/                # Home screen
│       ├── booking/             # Booking screens (list, detail, create)
│       ├── profile/             # Profile screen
│       └── blog/                # Blog screens (list, detail)
├── pubspec.yaml
└── README.md
```

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `flutter_bloc` | State management |
| `dio` | HTTP client |
| `get_it` | Dependency injection |
| `shared_preferences` | Local storage |
| `intl` | Date/number formatting |
| `cached_network_image` | Image caching |
| `google_fonts` | Typography |
| `go_router` | Navigation |
| `equatable` | Value equality |

## 🎨 Theme

- **Primary Color:** #2563EB (Blue)
- **Secondary Color:** #10B981 (Green)
- **Font:** Inter (via Google Fonts)
- **Design System:** Material Design 3

## 🔌 API Configuration

Update API base URL di:
```
lib/core/constants/api_constants.dart
```

Default: `https://api.ningclean.com/api/v1`

## 📱 Features (Placeholder)

- ✅ Home screen dengan layanan populer
- ✅ Booking flow (create, view, cancel)
- ✅ Profile management
- ✅ Blog articles
- 🔜 Authentication (login/register)
- 🔜 Push notifications
- 🔜 Payment integration
- 🔜 Order tracking

## 🔧 Development

**Note:** Screen placeholder sudah dibuat dengan struktur UI yang baik. Untuk implementasi full,还需要:

1. Setup BLoC/Cubit untuk setiap feature
2. Implementasi API calls di repositories
3. Error handling & loading states
4. Unit & widget tests

## 📄 License

MIT License
