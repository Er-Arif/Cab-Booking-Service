import '../models/driver_models.dart';

class DemoDriverService {
  DriverDashboard getDashboard() {
    return DriverDashboard(
      todayEarnings: 620,
      completedRides: 8,
      acceptanceRate: 92,
      isOnline: true,
    );
  }

  DriverTrip getIncomingRequest() {
    return DriverTrip(
      passengerName: 'Aman Kumar',
      pickup: 'Madhupur Railway Station',
      drop: 'Main Market',
      estimatedFare: 35,
      status: 'New request',
    );
  }

  List<DriverTrip> getTripHistory() {
    return [
      DriverTrip(
        passengerName: 'Neha Devi',
        pickup: 'Bus Stand',
        drop: 'Hospital Area',
        estimatedFare: 58,
        status: 'Completed',
      ),
      DriverTrip(
        passengerName: 'Suresh Das',
        pickup: 'Main Market',
        drop: 'College Chowk',
        estimatedFare: 42,
        status: 'Completed',
      ),
    ];
  }
}
