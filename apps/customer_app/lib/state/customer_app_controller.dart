import 'dart:async';

import 'package:flutter/foundation.dart';

import '../models/auth_session.dart';
import '../models/customer_models.dart';
import '../services/auth_api_service.dart';
import '../services/customer_api_service.dart';
import '../services/session_storage.dart';

class CustomerAppController extends ChangeNotifier {
  CustomerAppController({
    required AuthApiService authApi,
    required CustomerApiService customerApi,
    required SessionStorage sessionStorage,
  })  : _authApi = authApi,
        _customerApi = customerApi,
        _sessionStorage = sessionStorage;

  final AuthApiService _authApi;
  final CustomerApiService _customerApi;
  final SessionStorage _sessionStorage;

  bool _isBootstrapping = true;
  bool _isBusy = false;
  bool _isRefreshingData = false;
  bool _isSavingProfile = false;
  bool _isSubmittingComplaint = false;
  bool _otpRequested = false;
  bool _isPolling = false;
  String? _errorMessage;
  String? _feedbackMessage;
  String? _lastPhone;
  AuthSession? _session;
  CustomerProfile? _profile;
  List<Landmark> _landmarks = const [];
  List<RideRecord> _history = const [];
  RideRecord? _activeRide;
  FareEstimate? _latestEstimate;
  Timer? _pollingTimer;

  bool get isBootstrapping => _isBootstrapping;
  bool get isBusy => _isBusy;
  bool get isRefreshingData => _isRefreshingData;
  bool get isSavingProfile => _isSavingProfile;
  bool get isSubmittingComplaint => _isSubmittingComplaint;
  bool get isAuthenticated => _session != null;
  bool get otpRequested => _otpRequested;
  String? get errorMessage => _errorMessage;
  String? get feedbackMessage => _feedbackMessage;
  String? get currentPhone => _lastPhone;
  AuthSession? get session => _session;
  CustomerProfile? get profile => _profile;
  List<Landmark> get landmarks => _landmarks;
  List<RideRecord> get history => _history;
  RideRecord? get activeRide => _activeRide;
  FareEstimate? get latestEstimate => _latestEstimate;

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
      // Logout should still clear the local session if network revocation fails.
    }

    _session = null;
    _profile = null;
    _history = const [];
    _landmarks = const [];
    _activeRide = null;
    _latestEstimate = null;
    _otpRequested = false;
    _lastPhone = null;
    _errorMessage = null;
    _feedbackMessage = null;
    await _sessionStorage.clear();
    notifyListeners();
  }

  Future<void> refreshData({bool showLoader = false}) async {
    final session = _session;
    if (session == null) {
      return;
    }

    if (_isPolling) {
      return;
    }

    _isPolling = !showLoader;
    _isRefreshingData = showLoader;
    _errorMessage = null;
    notifyListeners();

    try {
      final results = await Future.wait<dynamic>([
        _customerApi.getProfile(session.accessToken),
        _customerApi.getLandmarks(session.accessToken),
        _customerApi.getHistory(session.accessToken),
        _customerApi.getActiveRide(session.accessToken),
      ]);

      _profile = results[0] as CustomerProfile;
      _landmarks = results[1] as List<Landmark>;
      _history = results[2] as List<RideRecord>;
      _activeRide = results[3] as RideRecord?;

      if (_activeRide == null || !_activeRide!.isOpen) {
        _latestEstimate = null;
      }
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isRefreshingData = false;
      _isPolling = false;
      notifyListeners();
    }
  }

  Future<void> estimateFare({
    required Landmark pickup,
    required Landmark drop,
    required String categoryKey,
  }) async {
    await _runBusy(() async {
      _latestEstimate = await _customerApi.estimateFare(
        categoryKey: categoryKey,
        pickup: pickup,
        drop: drop,
      );
      _feedbackMessage = 'Fare refreshed for ${formatCategoryLabel(categoryKey)}.';
    });
  }

  Future<void> createRide({
    required Landmark pickup,
    required Landmark drop,
    required String categoryKey,
    required String paymentMethod,
    String? pickupNote,
    String? dropNote,
  }) async {
    final session = _session;
    if (session == null) {
      return;
    }

    await _runBusy(() async {
      _activeRide = await _customerApi.createRide(
        accessToken: session.accessToken,
        categoryKey: categoryKey,
        paymentMethod: paymentMethod,
        pickup: pickup,
        drop: drop,
        pickupNote: _normalizeText(pickupNote),
        dropNote: _normalizeText(dropNote),
      );
      _feedbackMessage = 'Ride booked successfully.';
      await refreshData(showLoader: false);
    });
  }

  Future<void> saveProfile({
    required String name,
    String? email,
    String? emergencyContact,
    String? preferredPaymentMethod,
  }) async {
    final session = _session;
    if (session == null) {
      return;
    }

    _isSavingProfile = true;
    _errorMessage = null;
    _feedbackMessage = null;
    notifyListeners();

    try {
      _profile = await _customerApi.updateProfile(
        accessToken: session.accessToken,
        name: name.trim(),
        email: _normalizeText(email),
        emergencyContact: _normalizeText(emergencyContact),
        preferredPaymentMethod: preferredPaymentMethod,
      );
      _feedbackMessage = 'Profile updated.';
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isSavingProfile = false;
      notifyListeners();
    }
  }

  Future<void> submitComplaint({
    required String rideId,
    required String complaintType,
    required String description,
  }) async {
    final session = _session;
    if (session == null) {
      return;
    }

    _isSubmittingComplaint = true;
    _errorMessage = null;
    _feedbackMessage = null;
    notifyListeners();

    try {
      await _customerApi.submitComplaint(
        accessToken: session.accessToken,
        rideId: rideId,
        complaintType: complaintType.trim(),
        description: description.trim(),
      );
      _feedbackMessage = 'Complaint submitted for review.';
    } catch (error) {
      _errorMessage = error.toString();
    } finally {
      _isSubmittingComplaint = false;
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

  String? _normalizeText(String? value) {
    final trimmed = value?.trim();
    if (trimmed == null || trimmed.isEmpty) {
      return null;
    }
    return trimmed;
  }

  @override
  void dispose() {
    _stopPolling();
    super.dispose();
  }
}
