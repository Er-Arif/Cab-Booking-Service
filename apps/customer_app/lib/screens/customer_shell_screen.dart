import 'package:flutter/material.dart';

import '../app/customer_app_scope.dart';
import 'home/customer_dashboard_screen.dart';
import 'history/customer_history_screen.dart';
import 'profile/customer_profile_screen.dart';

class CustomerShellScreen extends StatefulWidget {
  const CustomerShellScreen({super.key});

  @override
  State<CustomerShellScreen> createState() => _CustomerShellScreenState();
}

class _CustomerShellScreenState extends State<CustomerShellScreen> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final controller = CustomerAppScope.of(context);
    final pages = <Widget>[
      const CustomerDashboardScreen(),
      const CustomerHistoryScreen(),
      CustomerProfileScreen(onLogout: controller.logout),
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
            icon: Icon(Icons.local_taxi_outlined),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.history_outlined),
            label: 'History',
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
