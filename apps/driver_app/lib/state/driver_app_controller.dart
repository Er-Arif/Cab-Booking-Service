import 'package:flutter/foundation.dart';

import '../models/auth_session.dart';
import '../services/auth_api_service.dart';
import '../services/session_storage.dart';

class DriverAppController extends ChangeNotifier {
  DriverAppController({
    required AuthApiService authApi,
    required SessionStorage sessionStorage,
  })  : _authApi = authApi,
        _sessionStorage = sessionStorage;

  final AuthApiService _authApi;
  final SessionStorage _sessionStorage;

  bool _isBootstrapping = true;
  bool _isBusy = false;
  bool _otpRequested = false;
  String? _errorMessage;
  String? _lastPhone;
  AuthSession? _session;

  bool get isBootstrapping => _isBootstrapping;
  bool get isBusy => _isBusy;
  bool get otpRequested => _otpRequested;
  bool get isAuthenticated => _session != null;
  String? get errorMessage => _errorMessage;
  AuthSession? get session => _session;

  Future<void> bootstrap() async {
    _isBootstrapping = true;
    notifyListeners();
    _session = await _sessionStorage.load();
    _isBootstrapping = false;
    notifyListeners();
  }

  Future<void> requestOtp(String phone) async {
    await _runBusy(() async {
      await _authApi.sendOtp(phone: phone);
      _otpRequested = true;
      _lastPhone = phone;
    });
  }

  Future<void> verifyOtp({
    required String phone,
    required String otp,
  }) async {
    await _runBusy(() async {
      final session = await _authApi.verifyOtp(phone: phone, otp: otp);
      _session = session;
      _otpRequested = false;
      _lastPhone = phone;
      await _sessionStorage.save(session);
    });
  }

  Future<void> logout() async {
    _session = null;
    _otpRequested = false;
    _lastPhone = null;
    _errorMessage = null;
    await _sessionStorage.clear();
    notifyListeners();
  }

  Future<void> _runBusy(Future<void> Function() action) async {
    _isBusy = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await action();
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isBusy = false;
      notifyListeners();
    }
  }
}
