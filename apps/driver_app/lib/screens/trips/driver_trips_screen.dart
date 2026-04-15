import 'package:flutter/material.dart';

class DriverTripsScreen extends StatelessWidget {
  const DriverTripsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Trips')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(
            child: ListTile(
              title: Text('Trips foundation ready'),
              subtitle: Text('Live requests, trip history, and ride actions will be added in the next chunks.'),
            ),
          ),
        ],
      ),
    );
  }
}
