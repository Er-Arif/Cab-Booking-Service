import 'package:flutter/material.dart';

import '../../app/customer_app_scope.dart';
import '../../models/customer_models.dart';

class CustomerDashboardScreen extends StatefulWidget {
  const CustomerDashboardScreen({super.key});

  @override
  State<CustomerDashboardScreen> createState() => _CustomerDashboardScreenState();
}

class _CustomerDashboardScreenState extends State<CustomerDashboardScreen> {
  final _pickupNoteController = TextEditingController();
  final _dropNoteController = TextEditingController();
  final _complaintTypeController = TextEditingController(text: 'service_issue');
  final _complaintDescriptionController = TextEditingController();

  String? _pickupId;
  String? _dropId;
  String _categoryKey = 'bike';
  String _paymentMethod = 'cash';

  @override
  void dispose() {
    _pickupNoteController.dispose();
    _dropNoteController.dispose();
    _complaintTypeController.dispose();
    _complaintDescriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = CustomerAppScope.of(context);
    final landmarks = controller.landmarks;

    if (_pickupId == null && landmarks.isNotEmpty) {
      _pickupId = landmarks.first.id;
      _dropId = landmarks.length > 1 ? landmarks[1].id : landmarks.first.id;
    }

    final pickup = _findLandmark(landmarks, _pickupId);
    final drop = _findLandmark(landmarks, _dropId);
    final estimate = controller.latestEstimate;
    final activeRide = controller.activeRide;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Book a ride'),
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
          _SectionCard(
            title: 'Service status',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Signed in as ${controller.profile?.name ?? controller.session?.phone ?? 'Customer'}'),
                const SizedBox(height: 8),
                Text(
                  activeRide == null
                      ? 'No active booking. You can estimate a fare and create a new ride now.'
                      : 'Current ride status: ${formatRideStatus(activeRide.status)}',
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
              ],
            ),
          ),
          const SizedBox(height: 16),
          if (controller.isRefreshingData)
            const Padding(
              padding: EdgeInsets.only(bottom: 16),
              child: LinearProgressIndicator(),
            ),
          _SectionCard(
            title: 'Choose your trip',
            child: landmarks.isEmpty
                ? const Text('Landmarks will appear here after the app syncs with the backend.')
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      DropdownButtonFormField<String>(
                        value: _pickupId,
                        decoration: const InputDecoration(labelText: 'Pickup landmark'),
                        items: landmarks
                            .map(
                              (landmark) => DropdownMenuItem(
                                value: landmark.id,
                                child: Text(landmark.name),
                              ),
                            )
                            .toList(),
                        onChanged: activeRide != null
                            ? null
                            : (value) {
                                setState(() {
                                  _pickupId = value;
                                });
                              },
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _dropId,
                        decoration: const InputDecoration(labelText: 'Drop landmark'),
                        items: landmarks
                            .map(
                              (landmark) => DropdownMenuItem(
                                value: landmark.id,
                                child: Text(landmark.name),
                              ),
                            )
                            .toList(),
                        onChanged: activeRide != null
                            ? null
                            : (value) {
                                setState(() {
                                  _dropId = value;
                                });
                              },
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _categoryKey,
                        decoration: const InputDecoration(labelText: 'Ride category'),
                        items: const [
                          DropdownMenuItem(value: 'bike', child: Text('Bike')),
                          DropdownMenuItem(value: 'e_rickshaw', child: Text('E-rickshaw')),
                        ],
                        onChanged: activeRide != null
                            ? null
                            : (value) {
                                if (value == null) {
                                  return;
                                }
                                setState(() {
                                  _categoryKey = value;
                                });
                              },
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _paymentMethod,
                        decoration: const InputDecoration(labelText: 'Payment method'),
                        items: const [
                          DropdownMenuItem(value: 'cash', child: Text('Cash')),
                          DropdownMenuItem(value: 'upi', child: Text('UPI')),
                        ],
                        onChanged: activeRide != null
                            ? null
                            : (value) {
                                if (value == null) {
                                  return;
                                }
                                setState(() {
                                  _paymentMethod = value;
                                });
                              },
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _pickupNoteController,
                        enabled: activeRide == null,
                        decoration: const InputDecoration(
                          labelText: 'Pickup note',
                          hintText: 'Example: near the main gate',
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _dropNoteController,
                        enabled: activeRide == null,
                        decoration: const InputDecoration(
                          labelText: 'Drop note',
                          hintText: 'Example: behind the market lane',
                        ),
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: [
                          FilledButton.tonal(
                            onPressed: controller.isBusy || pickup == null || drop == null || activeRide != null
                                ? null
                                : () {
                                    controller.estimateFare(
                                      pickup: pickup,
                                      drop: drop,
                                      categoryKey: _categoryKey,
                                    );
                                  },
                            child: const Text('Estimate Fare'),
                          ),
                          FilledButton(
                            onPressed: controller.isBusy || pickup == null || drop == null || activeRide != null
                                ? null
                                : () {
                                    controller.createRide(
                                      pickup: pickup,
                                      drop: drop,
                                      categoryKey: _categoryKey,
                                      paymentMethod: _paymentMethod,
                                      pickupNote: _pickupNoteController.text,
                                      dropNote: _dropNoteController.text,
                                    );
                                  },
                            child: const Text('Book Ride'),
                          ),
                        ],
                      ),
                      if (controller.isBusy) ...[
                        const SizedBox(height: 16),
                        const LinearProgressIndicator(),
                      ],
                    ],
                  ),
          ),
          const SizedBox(height: 16),
          if (estimate != null)
            _SectionCard(
              title: 'Latest estimate',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${formatCategoryLabel(estimate.categoryKey)} ride'),
                  const SizedBox(height: 8),
                  Text('Distance: ${estimate.distanceKm.toStringAsFixed(2)} km'),
                  Text('Estimated fare: Rs ${estimate.estimatedFare.toStringAsFixed(0)}'),
                ],
              ),
            ),
          if (estimate != null) const SizedBox(height: 16),
          _SectionCard(
            title: 'Active ride',
            child: activeRide == null
                ? const Text('No active ride right now.')
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${formatCategoryLabel(activeRide.categoryKey)} • ${formatRideStatus(activeRide.status)}',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                      ),
                      const SizedBox(height: 8),
                      Text('Pickup: ${activeRide.pickupAddress}'),
                      Text('Drop: ${activeRide.dropAddress}'),
                      Text('Payment: ${activeRide.paymentMethod.toUpperCase()} • ${activeRide.paymentStatus}'),
                      Text('Fare: Rs ${(activeRide.finalFare ?? activeRide.estimatedFare).toStringAsFixed(0)}'),
                      if ((activeRide.pickupNote ?? '').isNotEmpty) Text('Pickup note: ${activeRide.pickupNote}'),
                      if ((activeRide.dropNote ?? '').isNotEmpty) Text('Drop note: ${activeRide.dropNote}'),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _complaintTypeController,
                        decoration: const InputDecoration(
                          labelText: 'Complaint type',
                          hintText: 'overcharge, delay, service_issue',
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _complaintDescriptionController,
                        minLines: 2,
                        maxLines: 4,
                        decoration: const InputDecoration(
                          labelText: 'Describe the issue',
                        ),
                      ),
                      const SizedBox(height: 12),
                      FilledButton.tonal(
                        onPressed: controller.isSubmittingComplaint
                            ? null
                            : () {
                                controller.submitComplaint(
                                  rideId: activeRide.id,
                                  complaintType: _complaintTypeController.text,
                                  description: _complaintDescriptionController.text,
                                );
                                _complaintDescriptionController.clear();
                              },
                        child: const Text('Submit complaint'),
                      ),
                    ],
                  ),
          ),
        ],
      ),
    );
  }

  Landmark? _findLandmark(List<Landmark> landmarks, String? id) {
    if (id == null) {
      return null;
    }

    for (final landmark in landmarks) {
      if (landmark.id == id) {
        return landmark;
      }
    }
    return null;
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
