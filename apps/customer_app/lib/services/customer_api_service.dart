import '../models/customer_models.dart';
import 'api_client.dart';

class CustomerApiService {
  CustomerApiService(this._client);

  final ApiClient _client;

  Future<CustomerProfile> getProfile(String accessToken) async {
    final response = await _client.getJson(
      '/api/customer/profile',
      accessToken: accessToken,
    ) as Map<String, dynamic>;
    return CustomerProfile.fromJson(response);
  }

  Future<CustomerProfile> updateProfile({
    required String accessToken,
    required String name,
    String? email,
    String? emergencyContact,
    String? preferredPaymentMethod,
  }) async {
    final response = await _client.putJson(
      '/api/customer/profile',
      accessToken: accessToken,
      body: {
        'name': name,
        'email': email,
        'emergencyContact': emergencyContact,
        'preferredPaymentMethod': preferredPaymentMethod,
      },
    ) as Map<String, dynamic>;

    return CustomerProfile.fromJson(response);
  }

  Future<List<Landmark>> getLandmarks(String accessToken) async {
    final response = await _client.getJson(
      '/api/customer/landmarks',
      accessToken: accessToken,
    ) as List<dynamic>;

    return response
        .cast<Map<String, dynamic>>()
        .map(Landmark.fromJson)
        .toList();
  }

  Future<FareEstimate> estimateFare({
    required String categoryKey,
    required Landmark pickup,
    required Landmark drop,
  }) async {
    final response = await _client.postJson(
      '/api/pricing/estimate',
      body: {
        'categoryKey': categoryKey,
        'pickup': {
          'latitude': pickup.latitude,
          'longitude': pickup.longitude,
        },
        'drop': {
          'latitude': drop.latitude,
          'longitude': drop.longitude,
        },
      },
    );

    return FareEstimate.fromJson(categoryKey, response);
  }

  Future<RideRecord> createRide({
    required String accessToken,
    required String categoryKey,
    required String paymentMethod,
    required Landmark pickup,
    required Landmark drop,
    String? pickupNote,
    String? dropNote,
  }) async {
    final response = await _client.postJson(
      '/api/rides',
      accessToken: accessToken,
      body: {
        'categoryKey': categoryKey,
        'pickupAddress': pickup.name,
        'dropAddress': drop.name,
        'pickupNote': pickupNote,
        'dropNote': dropNote,
        'pickup': {
          'latitude': pickup.latitude,
          'longitude': pickup.longitude,
        },
        'drop': {
          'latitude': drop.latitude,
          'longitude': drop.longitude,
        },
        'paymentMethod': paymentMethod,
      },
    );

    return RideRecord.fromJson(response['ride'] as Map<String, dynamic>);
  }

  Future<RideRecord?> getActiveRide(String accessToken) async {
    final response = await _client.getJson(
      '/api/customer/active-ride',
      accessToken: accessToken,
    );

    if (response == null) {
      return null;
    }

    return RideRecord.fromJson(response as Map<String, dynamic>);
  }

  Future<List<RideRecord>> getHistory(String accessToken) async {
    final response = await _client.getJson(
      '/api/customer/rides/history',
      accessToken: accessToken,
    ) as List<dynamic>;

    return response
        .cast<Map<String, dynamic>>()
        .map(RideRecord.fromJson)
        .toList();
  }

  Future<void> submitComplaint({
    required String accessToken,
    required String rideId,
    required String complaintType,
    required String description,
  }) async {
    await _client.postJson(
      '/api/customer/complaints',
      accessToken: accessToken,
      body: {
        'rideId': rideId,
        'complaintType': complaintType,
        'description': description,
      },
    );
  }
}
