import 'package:flutter/material.dart';

import '../../app/customer_app_scope.dart';

class CustomerDashboardScreen extends StatelessWidget {
  const CustomerDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final session = CustomerAppScope.of(context).session;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Madhupur Customer'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _SectionCard(
            title: 'Phase 4.1 foundation complete',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Signed in as ${session?.phone ?? 'Unknown'}'),
                const SizedBox(height: 8),
                const Text('This app now has:'),
                const SizedBox(height: 8),
                const Text('• environment-aware API base URL'),
                const Text('• HTTP client foundation'),
                const Text('• OTP auth against the live backend'),
                const Text('• session persistence'),
                const Text('• app-shell navigation for next chunks'),
              ],
            ),
          ),
          const SizedBox(height: 16),
          _SectionCard(
            title: 'Next customer chunk',
            child: const Text(
              'Chunk 4.2 will connect landmark selection, fare estimate, booking creation, and active ride state.',
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({
    required this.title,
    required this.child,
  });

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
            ),
            const SizedBox(height: 12),
            child,
          ],
        ),
      ),
    );
  }
}
