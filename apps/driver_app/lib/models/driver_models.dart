class DriverTrip {
  DriverTrip({
    required this.passengerName,
    required this.pickup,
    required this.drop,
    required this.estimatedFare,
    required this.status,
  });

  final String passengerName;
  final String pickup;
  final String drop;
  final int estimatedFare;
  final String status;
}

class DriverDashboard {
  DriverDashboard({
    required this.todayEarnings,
    required this.completedRides,
    required this.acceptanceRate,
    required this.isOnline,
  });

  final int todayEarnings;
  final int completedRides;
  final int acceptanceRate;
  final bool isOnline;
}
