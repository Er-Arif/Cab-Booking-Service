import 'package:flutter/material.dart';

import '../../app/customer_app_scope.dart';

class CustomerProfileScreen extends StatelessWidget {
  const CustomerProfileScreen({
    super.key,
    required this.onLogout,
  });

  final Future<void> Function() onLogout;

  @override
  Widget build(BuildContext context) {
    final session = CustomerAppScope.of(context).session;

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
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
                    'Current session',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  const SizedBox(height: 12),
                  Text('Role: ${session?.role ?? 'customer'}'),
                  Text('Phone: ${session?.phone ?? 'Unknown'}'),
                  Text('User ID: ${session?.userId ?? 'Unknown'}'),
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: () {
                      onLogout();
                    },
                    child: const Text('Logout'),
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
