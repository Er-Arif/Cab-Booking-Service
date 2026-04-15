import '../models/customer_models.dart';

class DemoCustomerService {
  List<String> getLandmarks() {
    return const [
      'Madhupur Railway Station',
      'Bus Stand',
      'Main Market',
      'Hospital Area',
      'College Chowk',
    ];
  }

  List<RideOption> getRideOptions() {
    return [
      RideOption(
        title: 'Bike',
        subtitle: 'Fast and affordable for one passenger',
        estimatedFare: 35,
        etaMinutes: 4,
      ),
      RideOption(
        title: 'E-rickshaw',
        subtitle: 'Better for family and market trips',
        estimatedFare: 55,
        etaMinutes: 6,
      ),
    ];
  }

  LiveRideState getActiveRide() {
    return LiveRideState(
      status: 'Driver arriving',
      driverName: 'Rakesh Yadav',
      vehicleLabel: 'Bike • JH-15AB-1010',
      pickup: 'Madhupur Railway Station',
      drop: 'Main Market',
      paymentMethod: 'Cash',
    );
  }
}
