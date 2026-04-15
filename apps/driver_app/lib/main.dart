import 'package:flutter/material.dart';

import 'screens/driver_home_screen.dart';

void main() {
  runApp(const DriverApp());
}

class DriverApp extends StatelessWidget {
  const DriverApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Madhupur Driver',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFD96C06)),
        scaffoldBackgroundColor: const Color(0xFFF6F0E4),
        useMaterial3: true,
      ),
      home: const DriverHomeScreen(),
    );
  }
}
