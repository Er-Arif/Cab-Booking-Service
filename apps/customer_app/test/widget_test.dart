import 'package:flutter_test/flutter_test.dart';
import 'package:madhupur_customer_app/main.dart';
import 'package:madhupur_customer_app/models/auth_session.dart';
import 'package:madhupur_customer_app/models/customer_models.dart';
import 'package:madhupur_customer_app/services/api_client.dart';
import 'package:madhupur_customer_app/services/auth_api_service.dart';
import 'package:madhupur_customer_app/services/customer_api_service.dart';
import 'package:madhupur_customer_app/services/session_storage.dart';
import 'package:madhupur_customer_app/state/customer_app_controller.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('shows customer login screen when there is no stored session', (tester) async {
    final controller = CustomerAppController(
      authApi: _FakeCustomerAuthApiService(),
      customerApi: _FakeCustomerApiService(),
      sessionStorage: _FakeCustomerSessionStorage(),
    );

    await tester.pumpWidget(CustomerApp(controller: controller));
    await tester.pumpAndSettle();

    expect(find.text('Customer Sign In'), findsOneWidget);
    expect(find.text('Send OTP'), findsOneWidget);
  });

  testWidgets('shows customer shell when a stored session exists', (tester) async {
    final controller = CustomerAppController(
      authApi: _FakeCustomerAuthApiService(),
      customerApi: _FakeCustomerApiService(),
      sessionStorage: _FakeCustomerSessionStorage(
        session: const AuthSession(
          accessToken: 'customer-token',
          refreshToken: 'customer-refresh',
          userId: 'customer-1',
          role: 'customer',
          phone: '9000000002',
        ),
      ),
    );

    await tester.pumpWidget(CustomerApp(controller: controller));
    await tester.pumpAndSettle();

    expect(find.text('Book a ride'), findsOneWidget);
    expect(find.text('Ride history'), findsNothing);
  });
}

class _FakeCustomerAuthApiService extends AuthApiService {
  _FakeCustomerAuthApiService() : super(ApiClient(baseUrl: 'http://localhost'));

  @override
  Future<void> sendOtp({required String phone}) async {}

  @override
  Future<AuthSession> verifyOtp({required String phone, required String otp}) async {
    return AuthSession(
      accessToken: 'customer-token',
      refreshToken: 'customer-refresh',
      userId: 'customer-1',
      role: 'customer',
      phone: phone,
    );
  }

  @override
  Future<void> logout(String refreshToken) async {}
}

class _FakeCustomerApiService extends CustomerApiService {
  _FakeCustomerApiService() : super(ApiClient(baseUrl: 'http://localhost'));

  @override
  Future<CustomerProfile> getProfile(String accessToken) async {
    return const CustomerProfile(
      id: 'customer-1',
      name: 'Aman Kumar',
      phone: '9000000002',
      preferredPaymentMethod: 'cash',
    );
  }

  @override
  Future<List<Landmark>> getLandmarks(String accessToken) async {
    return const [
      Landmark(
        id: 'landmark-1',
        name: 'Madhupur Railway Station',
        address: 'Station Road',
        latitude: 24.2733,
        longitude: 86.6467,
      ),
      Landmark(
        id: 'landmark-2',
        name: 'Main Market',
        address: 'Town Center',
        latitude: 24.2714,
        longitude: 86.6395,
      ),
    ];
  }

  @override
  Future<List<RideRecord>> getHistory(String accessToken) async {
    return const [];
  }

  @override
  Future<RideRecord?> getActiveRide(String accessToken) async {
    return null;
  }
}

class _FakeCustomerSessionStorage extends SessionStorage {
  _FakeCustomerSessionStorage({this.session});

  final AuthSession? session;

  @override
  Future<AuthSession?> load() async => session;

  @override
  Future<void> save(AuthSession session) async {}

  @override
  Future<void> clear() async {}
}
