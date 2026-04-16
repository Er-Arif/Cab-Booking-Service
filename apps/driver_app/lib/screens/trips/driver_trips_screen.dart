import 'package:flutter/material.dart';

import '../../app/driver_app_scope.dart';
import '../../models/driver_models.dart';

class DriverTripsScreen extends StatelessWidget {
  const DriverTripsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = DriverAppScope.of(context);
    final earnings = controller.earnings;
    final rides = controller.history;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Trips and earnings'),
        actions: [
          IconButton(
            tooltip: 'Refresh',
            onPressed: () => controller.refreshData(showLoader: true),
            icon: const Icon(Icons.refresh),
          ),
        ],
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
                    'Earnings summary',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 12),
                  Text('Completed rides: ${earnings?.totalCompletedRides ?? 0}'),
                  Text('Gross collected: Rs ${(earnings?.grossCollected ?? 0).toStringAsFixed(0)}'),
                  Text('Pending payout: Rs ${(earnings?.pendingPayout ?? 0).toStringAsFixed(0)}'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Trip history',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          if (rides.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(18),
                child: Text('Completed and cancelled rides will appear here after dispatch starts.'),
              ),
            )
          else
            ...rides.map(
              (ride) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Card(
                  child: ListTile(
                    title: Text('${ride.pickupAddress} → ${ride.dropAddress}'),
                    subtitle: Text(
                      '${formatDriverRideStatus(ride.status)} • ${ride.paymentMethod.toUpperCase()}',
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
                ),
              ),
            ),
        ],
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
