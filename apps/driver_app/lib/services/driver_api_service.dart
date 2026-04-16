import '../models/driver_models.dart';
import 'api_client.dart';

class DriverApiService {
  DriverApiService(this._client);

  final ApiClient _client;

  Future<DriverProfile> getProfile(String accessToken) async {
    final response = await _client.getJson(
      '/api/driver/profile',
      accessToken: accessToken,
    ) as Map<String, dynamic>;
    return DriverProfile.fromJson(response);
  }

  Future<DriverProfile> updateAvailability({
    required String accessToken,
    required bool isOnline,
  }) async {
    final response = await _client.patchJson(
      '/api/driver/availability',
      accessToken: accessToken,
      body: {
        'isOnline': isOnline,
      },
    ) as Map<String, dynamic>;

    return DriverProfile.fromJson(response);
  }

  Future<List<DriverRideRecord>> getRequests(String accessToken) async {
    final response = await _client.getJson(
      '/api/driver/requests',
      accessToken: accessToken,
    ) as List<dynamic>;

    return response
        .cast<Map<String, dynamic>>()
        .map(DriverRideRecord.fromJson)
        .toList();
  }

  Future<DriverRideRecord?> getActiveRide(String accessToken) async {
    final response = await _client.getJson(
      '/api/driver/active-ride',
      accessToken: accessToken,
    );

    if (response == null) {
      return null;
    }

    return DriverRideRecord.fromJson(response as Map<String, dynamic>);
  }

  Future<List<DriverRideRecord>> getHistory(String accessToken) async {
    final response = await _client.getJson(
      '/api/driver/history',
      accessToken: accessToken,
    ) as List<dynamic>;

    return response
        .cast<Map<String, dynamic>>()
        .map(DriverRideRecord.fromJson)
        .toList();
  }

  Future<DriverEarnings> getEarnings(String accessToken) async {
    final response = await _client.getJson(
      '/api/driver/earnings',
      accessToken: accessToken,
    ) as Map<String, dynamic>;

    return DriverEarnings.fromJson(response);
  }

  Future<DriverRideRecord> updateRideStatus({
    required String accessToken,
    required String rideId,
    required String status,
  }) async {
    final response = await _client.patchJson(
      '/api/rides/$rideId/status',
      accessToken: accessToken,
      body: {
        'status': status,
      },
    ) as Map<String, dynamic>;

    return DriverRideRecord.fromJson(response);
  }

  Future<DriverRideRecord> markPaymentComplete({
    required String accessToken,
    required String rideId,
  }) async {
    final response = await _client.patchJson(
      '/api/rides/$rideId/payment',
      accessToken: accessToken,
      body: const {},
    ) as Map<String, dynamic>;

    return DriverRideRecord.fromJson(response['ride'] as Map<String, dynamic>);
  }

  Future<void> submitIssue({
    required String accessToken,
    required String rideId,
    required String complaintType,
    required String description,
  }) async {
    await _client.postJson(
      '/api/driver/issues',
      accessToken: accessToken,
      body: {
        'rideId': rideId,
        'complaintType': complaintType,
        'description': description,
      },
    );
  }
}
