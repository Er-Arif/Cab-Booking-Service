class AuthSession {
  const AuthSession({
    required this.accessToken,
    required this.refreshToken,
    required this.userId,
    required this.role,
    required this.phone,
  });

  final String accessToken;
  final String refreshToken;
  final String userId;
  final String role;
  final String phone;

  Map<String, String> toJson() {
    return {
      'accessToken': accessToken,
      'refreshToken': refreshToken,
      'userId': userId,
      'role': role,
      'phone': phone,
    };
  }

  factory AuthSession.fromJson(Map<String, Object?> json) {
    return AuthSession(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
      userId: json['userId'] as String,
      role: json['role'] as String,
      phone: json['phone'] as String,
    );
  }
}
