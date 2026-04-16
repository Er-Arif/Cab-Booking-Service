import '../models/auth_session.dart';
import 'api_client.dart';

class AuthApiService {
  AuthApiService(this._client);

  final ApiClient _client;

  Future<void> sendOtp({
    required String phone,
  }) async {
    await _client.postJson(
      '/api/auth/send-otp',
      body: {
        'phone': phone,
        'role': 'customer',
      },
    );
  }

  Future<AuthSession> verifyOtp({
    required String phone,
    required String otp,
  }) async {
    final response = await _client.postJson(
      '/api/auth/verify-otp',
      body: {
        'phone': phone,
        'otp': otp,
        'role': 'customer',
      },
    );

    return AuthSession(
      accessToken: response['accessToken'] as String,
      refreshToken: response['refreshToken'] as String,
      userId: response['userId'] as String,
      role: response['role'] as String,
      phone: phone,
    );
  }

  Future<void> logout(String refreshToken) async {
    await _client.postJson(
      '/api/auth/logout',
      body: {
        'refreshToken': refreshToken,
      },
    );
  }
}
