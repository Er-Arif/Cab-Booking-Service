import 'package:flutter/material.dart';

import 'app/customer_app_scope.dart';
import 'app/customer_theme.dart';
import 'config/app_config.dart';
import 'screens/auth/customer_login_screen.dart';
import 'screens/customer_shell_screen.dart';
import 'services/api_client.dart';
import 'services/auth_api_service.dart';
import 'services/session_storage.dart';
import 'state/customer_app_controller.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const CustomerApp());
}

class CustomerApp extends StatefulWidget {
  const CustomerApp({super.key});

  @override
  State<CustomerApp> createState() => _CustomerAppState();
}

class _CustomerAppState extends State<CustomerApp> {
  late final CustomerAppController _controller;

  @override
  void initState() {
    super.initState();
    _controller = CustomerAppController(
      authApi: AuthApiService(
        ApiClient(baseUrl: AppConfig.apiBaseUrl),
      ),
      sessionStorage: SessionStorage(),
    )..bootstrap();
  }

  @override
  Widget build(BuildContext context) {
    return CustomerAppScope(
      controller: _controller,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, _) {
          return MaterialApp(
            title: 'Madhupur Customer',
            debugShowCheckedModeBanner: false,
            theme: buildCustomerTheme(),
            home: _controller.isBootstrapping
                ? const Scaffold(
                    body: Center(child: CircularProgressIndicator()),
                  )
                : _controller.isAuthenticated
                    ? const CustomerShellScreen()
                    : const CustomerLoginScreen(),
          );
        },
      ),
    );
  }
}
