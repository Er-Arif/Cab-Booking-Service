import 'package:flutter/material.dart';

import '../../app/driver_app_scope.dart';
import '../../models/driver_models.dart';

class DriverProfileScreen extends StatelessWidget {
  const DriverProfileScreen({
    super.key,
    required this.onLogout,
  });

  final Future<void> Function() onLogout;

  @override
  Widget build(BuildContext context) {
    final controller = DriverAppScope.of(context);
    final profile = controller.profile;

    return Scaffold(
      appBar: AppBar(title: const Text('Driver profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    profile?.name ?? 'Driver account',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 12),
                  Text('Phone: ${profile?.phone ?? controller.session?.phone ?? 'Unknown'}'),
                  Text('Vehicle: ${formatVehicleType(profile?.vehicleType ?? 'bike')} • ${profile?.vehicleNumber ?? 'Pending'}'),
                  Text('Verification: ${profile?.status ?? 'pending'}'),
                  Text('Rating: ${(profile?.rating ?? 0).toStringAsFixed(1)}'),
                  Text('Total rides: ${profile?.totalRides ?? 0}'),
                  if ((profile?.upiId ?? '').isNotEmpty) Text('UPI ID: ${profile?.upiId}'),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      OutlinedButton(
                        onPressed: () => controller.refreshData(showLoader: true),
                        child: const Text('Refresh'),
                      ),
                      OutlinedButton(
                        onPressed: () {
                          onLogout();
                        },
                        child: const Text('Logout'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
