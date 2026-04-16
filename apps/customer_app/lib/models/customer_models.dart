class CustomerProfile {
  const CustomerProfile({
    required this.id,
    required this.name,
    required this.phone,
    this.email,
    this.emergencyContact,
    this.preferredPaymentMethod,
  });

  final String id;
  final String name;
  final String phone;
  final String? email;
  final String? emergencyContact;
  final String? preferredPaymentMethod;

  factory CustomerProfile.fromJson(Map<String, dynamic> json) {
    return CustomerProfile(
      id: json['id'] as String,
      name: json['name'] as String? ?? 'Customer',
      phone: json['phone'] as String? ?? '',
      email: json['email'] as String?,
      emergencyContact: json['emergencyContact'] as String?,
      preferredPaymentMethod: json['preferredPaymentMethod'] as String?,
    );
  }
}

class Landmark {
  const Landmark({
    required this.id,
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
  });

  final String id;
  final String name;
  final String address;
  final double latitude;
  final double longitude;

  factory Landmark.fromJson(Map<String, dynamic> json) {
    return Landmark(
      id: json['id'] as String,
      name: json['name'] as String,
      address: json['address'] as String? ?? '',
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
    );
  }
}

class FareEstimate {
  const FareEstimate({
    required this.categoryKey,
    required this.distanceKm,
    required this.estimatedFare,
  });

  final String categoryKey;
  final double distanceKm;
  final double estimatedFare;

  factory FareEstimate.fromJson(String categoryKey, Map<String, dynamic> json) {
    return FareEstimate(
      categoryKey: categoryKey,
      distanceKm: (json['distanceKm'] as num).toDouble(),
      estimatedFare: (json['estimatedFare'] as num).toDouble(),
    );
  }
}

class RideRecord {
  const RideRecord({
    required this.id,
    required this.categoryKey,
    required this.pickupAddress,
    required this.dropAddress,
    required this.estimatedFare,
    required this.paymentMethod,
    required this.paymentStatus,
    required this.status,
    required this.bookedAt,
    required this.customerId,
    this.driverId,
    this.finalFare,
    this.pickupNote,
    this.dropNote,
    this.completedAt,
  });

  final String id;
  final String customerId;
  final String? driverId;
  final String categoryKey;
  final String pickupAddress;
  final String dropAddress;
  final String? pickupNote;
  final String? dropNote;
  final double estimatedFare;
  final double? finalFare;
  final String paymentMethod;
  final String paymentStatus;
  final String status;
  final DateTime bookedAt;
  final DateTime? completedAt;

  bool get isOpen => !const {
        'payment_completed',
        'cancelled_by_user',
        'cancelled_by_driver',
        'cancelled_by_admin',
      }.contains(status);

  factory RideRecord.fromJson(Map<String, dynamic> json) {
    return RideRecord(
      id: json['id'] as String,
      customerId: json['customerId'] as String,
      driverId: json['driverId'] as String?,
      categoryKey: json['categoryKey'] as String,
      pickupAddress: json['pickupAddress'] as String,
      dropAddress: json['dropAddress'] as String,
      pickupNote: json['pickupNote'] as String?,
      dropNote: json['dropNote'] as String?,
      estimatedFare: (json['estimatedFare'] as num).toDouble(),
      finalFare: (json['finalFare'] as num?)?.toDouble(),
      paymentMethod: json['paymentMethod'] as String,
      paymentStatus: json['paymentStatus'] as String,
      status: json['status'] as String,
      bookedAt: DateTime.parse(json['bookedAt'] as String),
      completedAt: json['completedAt'] == null ? null : DateTime.parse(json['completedAt'] as String),
    );
  }
}

String formatRideStatus(String status) {
  return status
      .split('_')
      .map(
        (part) => part.isEmpty ? part : '${part[0].toUpperCase()}${part.substring(1)}',
      )
      .join(' ');
}

String formatCategoryLabel(String categoryKey) {
  return categoryKey == 'e_rickshaw' ? 'E-rickshaw' : 'Bike';
}
