import 'package:flutter/material.dart';

import 'screens/customer_home_screen.dart';

void main() {
  runApp(const CustomerApp());
}

class CustomerApp extends StatelessWidget {
  const CustomerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Madhupur Customer',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0E7A62)),
        scaffoldBackgroundColor: const Color(0xFFF5F0E5),
        useMaterial3: true,
      ),
      home: CustomerHomeScreen(),
    );
  }
}
