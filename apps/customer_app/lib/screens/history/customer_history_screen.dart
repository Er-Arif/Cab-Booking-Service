import 'package:flutter/material.dart';

class CustomerHistoryScreen extends StatelessWidget {
  const CustomerHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ride History')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(
            child: ListTile(
              title: Text('History foundation ready'),
              subtitle: Text('Live ride history API wiring is planned for Chunk 4.5.'),
            ),
          ),
        ],
      ),
    );
  }
}
