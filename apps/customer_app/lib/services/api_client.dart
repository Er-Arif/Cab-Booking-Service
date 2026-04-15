import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiClient {
  ApiClient({
    required this.baseUrl,
    http.Client? httpClient,
  }) : _httpClient = httpClient ?? http.Client();

  final String baseUrl;
  final http.Client _httpClient;

  Future<Map<String, dynamic>> postJson(
    String path, {
    Map<String, dynamic>? body,
    String? accessToken,
  }) async {
    final response = await _httpClient.post(
      Uri.parse('$baseUrl$path'),
      headers: {
        'Content-Type': 'application/json',
        if (accessToken != null) 'Authorization': 'Bearer $accessToken',
      },
      body: jsonEncode(body ?? <String, dynamic>{}),
    );

    return _decodeResponse(response);
  }

  Future<Map<String, dynamic>> getJson(
    String path, {
    String? accessToken,
  }) async {
    final response = await _httpClient.get(
      Uri.parse('$baseUrl$path'),
      headers: {
        if (accessToken != null) 'Authorization': 'Bearer $accessToken',
      },
    );

    return _decodeResponse(response);
  }

  Map<String, dynamic> _decodeResponse(http.Response response) {
    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode >= 400) {
      throw ApiException(
        message: decoded['message']?.toString() ?? 'Request failed',
        statusCode: response.statusCode,
      );
    }
    return decoded;
  }
}

class ApiException implements Exception {
  ApiException({
    required this.message,
    required this.statusCode,
  });

  final String message;
  final int statusCode;

  @override
  String toString() => 'ApiException($statusCode): $message';
}
