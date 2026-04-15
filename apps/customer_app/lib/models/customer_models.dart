class RideOption {
  RideOption({
    required this.title,
    required this.subtitle,
    required this.estimatedFare,
    required this.etaMinutes,
  });

  final String title;
  final String subtitle;
  final int estimatedFare;
  final int etaMinutes;
}

class LiveRideState {
  LiveRideState({
    required this.status,
    required this.driverName,
    required this.vehicleLabel,
    required this.pickup,
    required this.drop,
    required this.paymentMethod,
  });

  final String status;
  final String driverName;
  final String vehicleLabel;
  final String pickup;
  final String drop;
  final String paymentMethod;
}
