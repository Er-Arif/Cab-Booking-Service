import 'package:flutter/material.dart';

import 'app/driver_app_scope.dart';
import 'app/driver_theme.dart';
import 'config/app_config.dart';
import 'screens/auth/driver_login_screen.dart';
import 'screens/driver_shell_screen.dart';
import 'services/api_client.dart';
import 'services/auth_api_service.dart';
import 'services/driver_api_service.dart';
import 'services/session_storage.dart';
import 'state/driver_app_controller.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const DriverApp());
}

class DriverApp extends StatefulWidget {
  const DriverApp({
    super.key,
    this.controller,
  });

  final DriverAppController? controller;

  @override
  State<DriverApp> createState() => _DriverAppState();
}

class _DriverAppState extends State<DriverApp> {
  late final DriverAppController _controller;

  @override
  void initState() {
    super.initState();
    _controller = widget.controller ?? _createController();
    _controller.bootstrap();
  }

  DriverAppController _createController() {
    final apiClient = ApiClient(baseUrl: AppConfig.apiBaseUrl);
    return DriverAppController(
      authApi: AuthApiService(
        apiClient,
      ),
      driverApi: DriverApiService(apiClient),
      sessionStorage: SessionStorage(),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DriverAppScope(
      controller: _controller,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, _) {
          return MaterialApp(
            title: 'Madhupur Driver',
            debugShowCheckedModeBanner: false,
            theme: buildDriverTheme(),
            home: _controller.isBootstrapping
                ? const Scaffold(
                    body: Center(child: CircularProgressIndicator()),
                  )
                : _controller.isAuthenticated
                    ? const DriverShellScreen()
                    : const DriverLoginScreen(),
          );
        },
      ),
    );
  }
}
