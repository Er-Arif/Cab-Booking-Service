class DriverProfile {
  const DriverProfile({
    required this.id,
    required this.name,
    required this.phone,
    required this.vehicleType,
    required this.vehicleNumber,
    required this.status,
    required this.isOnline,
    required this.rating,
    required this.totalRides,
    this.upiId,
  });

  final String id;
  final String name;
  final String phone;
  final String vehicleType;
  final String vehicleNumber;
  final String status;
  final bool isOnline;
  final double rating;
  final int totalRides;
  final String? upiId;

  factory DriverProfile.fromJson(Map<String, dynamic> json) {
    return DriverProfile(
      id: json['id'] as String,
      name: json['name'] as String? ?? 'Driver',
      phone: json['phone'] as String? ?? '',
      vehicleType: json['vehicleType'] as String? ?? 'bike',
      vehicleNumber: json['vehicleNumber'] as String? ?? 'Unknown',
      status: json['status'] as String? ?? 'pending',
      isOnline: json['isOnline'] as bool? ?? false,
      rating: (json['rating'] as num?)?.toDouble() ?? 0,
      totalRides: json['totalRides'] as int? ?? 0,
      upiId: json['upiId'] as String?,
    );
  }
}

class DriverEarnings {
  const DriverEarnings({
    required this.totalCompletedRides,
    required this.grossCollected,
    required this.pendingPayout,
  });

  final int totalCompletedRides;
  final double grossCollected;
  final double pendingPayout;

  factory DriverEarnings.fromJson(Map<String, dynamic> json) {
    return DriverEarnings(
      totalCompletedRides: json['totalCompletedRides'] as int? ?? 0,
      grossCollected: (json['grossCollected'] as num?)?.toDouble() ?? 0,
      pendingPayout: (json['pendingPayout'] as num?)?.toDouble() ?? 0,
    );
  }
}

class DriverRideRecord {
  const DriverRideRecord({
    required this.id,
    required this.customerId,
    required this.categoryKey,
    required this.pickupAddress,
    required this.dropAddress,
    required this.estimatedFare,
    required this.paymentMethod,
    required this.paymentStatus,
    required this.status,
    required this.bookedAt,
    this.driverId,
    this.finalFare,
    this.pickupNote,
    this.dropNote,
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

  bool get needsPaymentConfirmation => status == 'trip_completed';

  factory DriverRideRecord.fromJson(Map<String, dynamic> json) {
    return DriverRideRecord(
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
    );
  }
}

String formatDriverRideStatus(String status) {
  return status
      .split('_')
      .map(
        (part) => part.isEmpty ? part : '${part[0].toUpperCase()}${part.substring(1)}',
      )
      .join(' ');
}

String formatVehicleType(String vehicleType) {
  return vehicleType == 'e_rickshaw' ? 'E-rickshaw' : 'Bike';
}
