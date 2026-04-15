import 'package:flutter/material.dart';

import '../../app/driver_app_scope.dart';

class DriverDashboardScreen extends StatelessWidget {
  const DriverDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final session = DriverAppScope.of(context).session;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Driver Console'),
      ),
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
                    'Phase 4.1 foundation complete',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  const SizedBox(height: 12),
                  Text('Signed in as ${session?.phone ?? 'Unknown'}'),
                  const SizedBox(height: 8),
                  const Text('This app now has:'),
                  const SizedBox(height: 8),
                  const Text('• environment-aware API base URL'),
                  const Text('• HTTP client foundation'),
                  const Text('• OTP auth against the live backend'),
                  const Text('• session persistence'),
                  const Text('• driver app-shell navigation'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Text(
                'Chunk 4.3 will wire availability, request handling, and ride actions onto this foundation.',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
