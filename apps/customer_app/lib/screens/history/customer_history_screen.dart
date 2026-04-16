import 'package:flutter/material.dart';

import '../../app/customer_app_scope.dart';
import '../../models/customer_models.dart';

class CustomerHistoryScreen extends StatelessWidget {
  const CustomerHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = CustomerAppScope.of(context);
    final rides = controller.history;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ride history'),
        actions: [
          IconButton(
            tooltip: 'Refresh history',
            onPressed: () => controller.refreshData(showLoader: true),
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: rides.isEmpty
          ? const Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text('Your completed and cancelled rides will show up here.'),
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: rides.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final ride = rides[index];
                return Card(
                  child: ListTile(
                    title: Text('${ride.pickupAddress} → ${ride.dropAddress}'),
                    subtitle: Text(
                      '${formatCategoryLabel(ride.categoryKey)} • ${formatRideStatus(ride.status)} • ${ride.paymentMethod.toUpperCase()}',
                    ),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('Rs ${(ride.finalFare ?? ride.estimatedFare).toStringAsFixed(0)}'),
                        Text(
                          _formatDate(ride.bookedAt),
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  String _formatDate(DateTime value) {
    final month = value.month.toString().padLeft(2, '0');
    final day = value.day.toString().padLeft(2, '0');
    final hour = value.hour.toString().padLeft(2, '0');
    final minute = value.minute.toString().padLeft(2, '0');
    return '$day/$month ${value.year} • $hour:$minute';
  }
}
