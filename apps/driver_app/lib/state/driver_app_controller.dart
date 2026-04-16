import 'dart:async';

import 'package:flutter/foundation.dart';

import '../models/auth_session.dart';
import '../models/driver_models.dart';
import '../services/auth_api_service.dart';
import '../services/driver_api_service.dart';
import '../services/session_storage.dart';

class DriverAppController extends ChangeNotifier {
  DriverAppController({
    required AuthApiService authApi,
    required DriverApiService driverApi,
    required SessionStorage sessionStorage,
  })  : _authApi = authApi,
        _driverApi = driverApi,
        _sessionStorage = sessionStorage;

  final AuthApiService _authApi;
  final DriverApiService _driverApi;
  final SessionStorage _sessionStorage;

  bool _isBootstrapping = true;
  bool _isBusy = false;
  bool _isRefreshingData = false;
  bool _isSubmittingIssue = false;
  bool _otpRequested = false;
  bool _isPolling = false;
  String? _errorMessage;
  String? _feedbackMessage;
  String? _lastPhone;
  AuthSession? _session;
  DriverProfile? _profile;
  DriverEarnings? _earnings;
  List<DriverRideRecord> _requests = const [];
  List<DriverRideRecord> _history = const [];
  DriverRideRecord? _activeRide;
  Timer? _pollingTimer;

  bool get isBootstrapping => _isBootstrapping;
  bool get isBusy => _isBusy;
  bool get isRefreshingData => _isRefreshingData;
  bool get isSubmittingIssue => _isSubmittingIssue;
  bool get otpRequested => _otpRequested;
  bool get isAuthenticated => _session != null;
  String? get errorMessage => _errorMessage;
  String? get feedbackMessage => _feedbackMessage;
  AuthSession? get session => _session;
  DriverProfile? get profile => _profile;
  DriverEarnings? get earnings => _earnings;
  List<DriverRideRecord> get requests => _requests;
  List<DriverRideRecord> get history => _history;
  DriverRideRecord? get activeRide => _activeRide;

  Future<void> bootstrap() async {
    _isBootstrapping = true;
    notifyListeners();
    _session = await _sessionStorage.load();
    _isBootstrapping = false;

    if (_session != null) {
      await refreshData(showLoader: true);
      _startPolling();
    } else {
      notifyListeners();
    }
  }

  Future<void> requestOtp(String phone) async {
    await _runBusy(() async {
      await _authApi.sendOtp(phone: phone);
      _otpRequested = true;
      _lastPhone = phone;
      _feedbackMessage = 'OTP sent. Use 123456 in local development.';
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
      await refreshData(showLoader: true);
      _startPolling();
    });
  }

  Future<void> logout() async {
    final session = _session;
    _stopPolling();

    try {
      if (session != null) {
        await _authApi.logout(session.refreshToken);
      }
    } catch (_) {
      // Local logout should succeed even if token revocation fails.
    }

    _session = null;
    _profile = null;
    _earnings = null;
    _requests = const [];
    _history = const [];
    _activeRide = null;
    _otpRequested = false;
    _lastPhone = null;
    _errorMessage = null;
    _feedbackMessage = null;
    await _sessionStorage.clear();
    notifyListeners();
  }

  Future<void> refreshData({bool showLoader = false}) async {
    final session = _session;
    if (session == null || _isPolling) {
      return;
    }

    _isPolling = !showLoader;
    _isRefreshingData = showLoader;
    _errorMessage = null;
    notifyListeners();

    try {
      final results = await Future.wait<dynamic>([
        _driverApi.getProfile(session.accessToken),
        _driverApi.getEarnings(session.accessToken),
        _driverApi.getRequests(session.accessToken),
        _driverApi.getHistory(session.accessToken),
        _driverApi.getActiveRide(session.accessToken),
      ]);

      _profile = results[0] as DriverProfile;
      _earnings = results[1] as DriverEarnings;
      _requests = results[2] as List<DriverRideRecord>;
      _history = results[3] as List<DriverRideRecord>;
      _activeRide = results[4] as DriverRideRecord?;
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isRefreshingData = false;
      _isPolling = false;
      notifyListeners();
    }
  }

  Future<void> toggleAvailability(bool isOnline) async {
    final session = _session;
    if (session == null) {
      return;
    }

    await _runBusy(() async {
      _profile = await _driverApi.updateAvailability(
        accessToken: session.accessToken,
        isOnline: isOnline,
      );
      _feedbackMessage = isOnline ? 'You are now online.' : 'You are now offline.';
      await refreshData(showLoader: false);
    });
  }

  Future<void> updateRideStatus({
    required String rideId,
    required String status,
  }) async {
    final session = _session;
    if (session == null) {
      return;
    }

    await _runBusy(() async {
      _activeRide = await _driverApi.updateRideStatus(
        accessToken: session.accessToken,
        rideId: rideId,
        status: status,
      );
      _feedbackMessage = 'Ride updated to ${formatDriverRideStatus(status)}.';
      await refreshData(showLoader: false);
    });
  }

  Future<void> markPaymentComplete(String rideId) async {
    final session = _session;
    if (session == null) {
      return;
    }

    await _runBusy(() async {
      _activeRide = await _driverApi.markPaymentComplete(
        accessToken: session.accessToken,
        rideId: rideId,
      );
      _feedbackMessage = 'Payment recorded for this trip.';
      await refreshData(showLoader: false);
    });
  }

  Future<void> submitIssue({
    required String rideId,
    required String complaintType,
    required String description,
  }) async {
    final session = _session;
    if (session == null) {
      return;
    }

    _isSubmittingIssue = true;
    _errorMessage = null;
    _feedbackMessage = null;
    notifyListeners();

    try {
      await _driverApi.submitIssue(
        accessToken: session.accessToken,
        rideId: rideId,
        complaintType: complaintType.trim(),
        description: description.trim(),
      );
      _feedbackMessage = 'Issue submitted to operations.';
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isSubmittingIssue = false;
      notifyListeners();
    }
  }

  Future<void> _runBusy(Future<void> Function() action) async {
    _isBusy = true;
    _errorMessage = null;
    _feedbackMessage = null;
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

  void _startPolling() {
    _stopPolling();
    _pollingTimer = Timer.periodic(
      const Duration(seconds: 8),
      (_) => refreshData(showLoader: false),
    );
  }

  void _stopPolling() {
    _pollingTimer?.cancel();
    _pollingTimer = null;
  }

  @override
  void dispose() {
    _stopPolling();
    super.dispose();
  }
}
