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
    final response = await _send(
      () => _httpClient.post(
        Uri.parse('$baseUrl$path'),
        headers: _headers(accessToken),
        body: jsonEncode(body ?? <String, dynamic>{}),
      ),
    );

    if (response is! Map<String, dynamic>) {
      throw ApiException(
        message: 'Expected a JSON object response.',
        statusCode: 500,
      );
    }

    return response;
  }

  Future<dynamic> getJson(
    String path, {
    String? accessToken,
  }) {
    return _send(
      () => _httpClient.get(
        Uri.parse('$baseUrl$path'),
        headers: {
          if (accessToken != null) 'Authorization': 'Bearer $accessToken',
        },
      ),
    );
  }

  Future<dynamic> patchJson(
    String path, {
    Map<String, dynamic>? body,
    String? accessToken,
  }) {
    return _send(
      () => _httpClient.patch(
        Uri.parse('$baseUrl$path'),
        headers: _headers(accessToken),
        body: jsonEncode(body ?? <String, dynamic>{}),
      ),
    );
  }

  Future<dynamic> putJson(
    String path, {
    Map<String, dynamic>? body,
    String? accessToken,
  }) {
    return _send(
      () => _httpClient.put(
        Uri.parse('$baseUrl$path'),
        headers: _headers(accessToken),
        body: jsonEncode(body ?? <String, dynamic>{}),
      ),
    );
  }

  Map<String, String> _headers(String? accessToken) {
    return {
      'Content-Type': 'application/json',
      if (accessToken != null) 'Authorization': 'Bearer $accessToken',
    };
  }

  Future<dynamic> _send(Future<http.Response> Function() request) async {
    final response = await request();
    final decoded = jsonDecode(response.body);
    if (response.statusCode >= 400) {
      throw ApiException(
        message: decoded is Map<String, dynamic>
            ? decoded['message']?.toString() ?? 'Request failed'
            : 'Request failed',
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
