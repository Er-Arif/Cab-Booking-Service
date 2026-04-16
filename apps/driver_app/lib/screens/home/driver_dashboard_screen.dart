import 'package:flutter/material.dart';

import '../../app/driver_app_scope.dart';
import '../../models/driver_models.dart';
import '../../state/driver_app_controller.dart';

class DriverDashboardScreen extends StatefulWidget {
  const DriverDashboardScreen({super.key});

  @override
  State<DriverDashboardScreen> createState() => _DriverDashboardScreenState();
}

class _DriverDashboardScreenState extends State<DriverDashboardScreen> {
  final _issueTypeController = TextEditingController(text: 'route_issue');
  final _issueDescriptionController = TextEditingController();

  @override
  void dispose() {
    _issueTypeController.dispose();
    _issueDescriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = DriverAppScope.of(context);
    final profile = controller.profile;
    final activeRide = controller.activeRide;
    final requests = controller.requests;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Driver console'),
        actions: [
          IconButton(
            tooltip: 'Refresh',
            onPressed: controller.isRefreshingData ? null : () => controller.refreshData(showLoader: true),
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
                    profile?.name ?? controller.session?.phone ?? 'Driver',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  Text('${formatVehicleType(profile?.vehicleType ?? 'bike')} • ${profile?.vehicleNumber ?? 'Vehicle pending'}'),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          profile?.isOnline == true ? 'You are visible for dispatch.' : 'You are offline for new trips.',
                        ),
                      ),
                      Switch(
                        value: profile?.isOnline ?? false,
                        onChanged: controller.isBusy ? null : controller.toggleAvailability,
                      ),
                    ],
                  ),
                  if (controller.feedbackMessage != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      controller.feedbackMessage!,
                      style: const TextStyle(color: Color(0xFF245B37)),
                    ),
                  ],
                  if (controller.errorMessage != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      controller.errorMessage!,
                      style: const TextStyle(color: Color(0xFFB23A2F)),
                    ),
                  ],
                  if (controller.isBusy || controller.isRefreshingData) ...[
                    const SizedBox(height: 12),
                    const LinearProgressIndicator(),
                  ],
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Active ride',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 12),
                  if (activeRide == null)
                    const Text('No active ride yet. Go online to start receiving bookings.')
                  else ...[
                    Text('${activeRide.pickupAddress} → ${activeRide.dropAddress}'),
                    const SizedBox(height: 8),
                    Text('${formatVehicleType(activeRide.categoryKey)} • ${formatDriverRideStatus(activeRide.status)}'),
                    Text('Fare: Rs ${(activeRide.finalFare ?? activeRide.estimatedFare).toStringAsFixed(0)}'),
                    Text('Payment: ${activeRide.paymentMethod.toUpperCase()} • ${activeRide.paymentStatus}'),
                    if ((activeRide.pickupNote ?? '').isNotEmpty) Text('Pickup note: ${activeRide.pickupNote}'),
                    if ((activeRide.dropNote ?? '').isNotEmpty) Text('Drop note: ${activeRide.dropNote}'),
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      children: _buildActionButtons(controller, activeRide),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _issueTypeController,
                      decoration: const InputDecoration(
                        labelText: 'Issue type',
                        hintText: 'route_issue, customer_issue, delay',
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _issueDescriptionController,
                      minLines: 2,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        labelText: 'Describe the issue',
                      ),
                    ),
                    const SizedBox(height: 12),
                    FilledButton.tonal(
                      onPressed: controller.isSubmittingIssue
                          ? null
                          : () {
                              controller.submitIssue(
                                rideId: activeRide.id,
                                complaintType: _issueTypeController.text,
                                description: _issueDescriptionController.text,
                              );
                              _issueDescriptionController.clear();
                            },
                      child: const Text('Report issue'),
                    ),
                  ],
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Incoming assignments',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 12),
                  if (requests.isEmpty)
                    const Text('No assigned rides are waiting right now.')
                  else
                    ...requests.map(
                      (ride) => ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text('${ride.pickupAddress} → ${ride.dropAddress}'),
                        subtitle: Text(
                          '${formatDriverRideStatus(ride.status)} • ${ride.paymentMethod.toUpperCase()} • Rs ${ride.estimatedFare.toStringAsFixed(0)}',
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildActionButtons(DriverAppController controller, DriverRideRecord ride) {
    switch (ride.status) {
      case 'driver_assigned':
        return [
          FilledButton(
            onPressed: controller.isBusy
                ? null
                : () => controller.updateRideStatus(
                      rideId: ride.id,
                      status: 'driver_arriving',
                    ),
            child: const Text('Start arriving'),
          ),
        ];
      case 'driver_arriving':
        return [
          FilledButton(
            onPressed: controller.isBusy
                ? null
                : () => controller.updateRideStatus(
                      rideId: ride.id,
                      status: 'driver_arrived',
                    ),
            child: const Text('Reached pickup'),
          ),
        ];
      case 'driver_arrived':
        return [
          FilledButton(
            onPressed: controller.isBusy
                ? null
                : () => controller.updateRideStatus(
                      rideId: ride.id,
                      status: 'trip_started',
                    ),
            child: const Text('Start trip'),
          ),
        ];
      case 'trip_started':
        return [
          FilledButton(
            onPressed: controller.isBusy
                ? null
                : () => controller.updateRideStatus(
                      rideId: ride.id,
                      status: 'trip_completed',
                    ),
            child: const Text('Complete trip'),
          ),
        ];
      case 'trip_completed':
        return [
          FilledButton(
            onPressed: controller.isBusy ? null : () => controller.markPaymentComplete(ride.id),
            child: const Text('Confirm payment'),
          ),
        ];
      default:
        return [
          const Chip(label: Text('Waiting for next backend update')),
        ];
    }
  }
}
