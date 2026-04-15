import 'package:flutter/material.dart';

import '../app/driver_app_scope.dart';
import 'home/driver_dashboard_screen.dart';
import 'profile/driver_profile_screen.dart';
import 'trips/driver_trips_screen.dart';

class DriverShellScreen extends StatefulWidget {
  const DriverShellScreen({super.key});

  @override
  State<DriverShellScreen> createState() => _DriverShellScreenState();
}

class _DriverShellScreenState extends State<DriverShellScreen> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final controller = DriverAppScope.of(context);
    final pages = <Widget>[
      const DriverDashboardScreen(),
      const DriverTripsScreen(),
      DriverProfileScreen(onLogout: controller.logout),
    ];

    return Scaffold(
      body: pages[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (index) {
          setState(() {
            _index = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.route_outlined),
            label: 'Trips',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
