import 'package:flutter_test/flutter_test.dart';
import 'package:madhupur_driver_app/main.dart';
import 'package:madhupur_driver_app/models/auth_session.dart';
import 'package:madhupur_driver_app/models/driver_models.dart';
import 'package:madhupur_driver_app/services/api_client.dart';
import 'package:madhupur_driver_app/services/auth_api_service.dart';
import 'package:madhupur_driver_app/services/driver_api_service.dart';
import 'package:madhupur_driver_app/services/session_storage.dart';
import 'package:madhupur_driver_app/state/driver_app_controller.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('shows driver login screen when there is no stored session', (tester) async {
    final controller = DriverAppController(
      authApi: _FakeDriverAuthApiService(),
      driverApi: _FakeDriverApiService(),
      sessionStorage: _FakeDriverSessionStorage(),
    );

    await tester.pumpWidget(DriverApp(controller: controller));
    await tester.pumpAndSettle();

    expect(find.text('Driver Sign In'), findsOneWidget);
    expect(find.text('Send OTP'), findsOneWidget);
  });

  testWidgets('shows driver shell when a stored session exists', (tester) async {
    final controller = DriverAppController(
      authApi: _FakeDriverAuthApiService(),
      driverApi: _FakeDriverApiService(),
      sessionStorage: _FakeDriverSessionStorage(
        session: const AuthSession(
          accessToken: 'driver-token',
          refreshToken: 'driver-refresh',
          userId: 'driver-1',
          role: 'driver',
          phone: '9000000003',
        ),
      ),
    );

    await tester.pumpWidget(DriverApp(controller: controller));
    await tester.pumpAndSettle();

    expect(find.text('Driver console'), findsOneWidget);
    expect(find.text('Driver Sign In'), findsNothing);
  });
}

class _FakeDriverAuthApiService extends AuthApiService {
  _FakeDriverAuthApiService() : super(ApiClient(baseUrl: 'http://localhost'));

  @override
  Future<void> sendOtp({required String phone}) async {}

  @override
  Future<AuthSession> verifyOtp({required String phone, required String otp}) async {
    return AuthSession(
      accessToken: 'driver-token',
      refreshToken: 'driver-refresh',
      userId: 'driver-1',
      role: 'driver',
      phone: phone,
    );
  }

  @override
  Future<void> logout(String refreshToken) async {}
}

class _FakeDriverApiService extends DriverApiService {
  _FakeDriverApiService() : super(ApiClient(baseUrl: 'http://localhost'));

  @override
  Future<DriverProfile> getProfile(String accessToken) async {
    return const DriverProfile(
      id: 'driver-1',
      name: 'Rakesh Yadav',
      phone: '9000000003',
      vehicleType: 'bike',
      vehicleNumber: 'JH-15AB-1010',
      status: 'approved',
      isOnline: true,
      rating: 4.7,
      totalRides: 12,
    );
  }

  @override
  Future<DriverEarnings> getEarnings(String accessToken) async {
    return const DriverEarnings(
      totalCompletedRides: 12,
      grossCollected: 640,
      pendingPayout: 512,
    );
  }

  @override
  Future<List<DriverRideRecord>> getRequests(String accessToken) async {
    return const [];
  }

  @override
  Future<List<DriverRideRecord>> getHistory(String accessToken) async {
    return const [];
  }

  @override
  Future<DriverRideRecord?> getActiveRide(String accessToken) async {
    return null;
  }
}

class _FakeDriverSessionStorage extends SessionStorage {
  _FakeDriverSessionStorage({this.session});

  final AuthSession? session;

  @override
  Future<AuthSession?> load() async => session;

  @override
  Future<void> save(AuthSession session) async {}

  @override
  Future<void> clear() async {}
}
