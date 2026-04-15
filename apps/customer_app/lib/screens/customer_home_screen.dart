import 'package:flutter/material.dart';

import '../services/demo_customer_service.dart';
import '../widgets/info_card.dart';

class CustomerHomeScreen extends StatelessWidget {
  CustomerHomeScreen({super.key});

  final DemoCustomerService service = DemoCustomerService();

  @override
  Widget build(BuildContext context) {
    final landmarks = service.getLandmarks();
    final rideOptions = service.getRideOptions();
    final activeRide = service.getActiveRide();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Madhupur Rides'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          InfoCard(
            title: 'Book your next ride',
            child: Column(
              children: [
                TextField(
                  decoration: const InputDecoration(
                    labelText: 'Pickup',
                    hintText: 'Choose a landmark or add a note',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  decoration: const InputDecoration(
                    labelText: 'Drop',
                    hintText: 'Enter destination',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: landmarks
                      .map(
                        (landmark) => Chip(
                          label: Text(landmark),
                        ),
                      )
                      .toList(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          InfoCard(
            title: 'Available ride types',
            child: Column(
              children: rideOptions
                  .map(
                    (option) => ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: CircleAvatar(
                        backgroundColor: const Color(0xFF0E7A62),
                        child: Text(option.title.substring(0, 1)),
                      ),
                      title: Text(option.title),
                      subtitle: Text(option.subtitle),
                      trailing: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('Rs ${option.estimatedFare}'),
                          Text('${option.etaMinutes} min'),
                        ],
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
          const SizedBox(height: 16),
          InfoCard(
            title: 'Active ride',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(activeRide.status, style: const TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                Text('Driver: ${activeRide.driverName}'),
                Text('Vehicle: ${activeRide.vehicleLabel}'),
                Text('Pickup: ${activeRide.pickup}'),
                Text('Drop: ${activeRide.drop}'),
                Text('Payment: ${activeRide.paymentMethod}'),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: FilledButton(
                        onPressed: () {},
                        child: const Text('Call Driver'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {},
                        child: const Text('Share Trip'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          InfoCard(
            title: 'History and support',
            child: Column(
              children: const [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text('Recent ride'),
                  subtitle: Text('Railway Station to Main Market • Rs 36 • Cash'),
                ),
                Divider(),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text('Raise ride issue'),
                  subtitle: Text('Overcharge, no-show, behavior, lost item'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
