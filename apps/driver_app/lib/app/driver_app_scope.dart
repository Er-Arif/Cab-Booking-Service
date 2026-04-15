import 'package:flutter/widgets.dart';

import '../state/driver_app_controller.dart';

class DriverAppScope extends InheritedNotifier<DriverAppController> {
  const DriverAppScope({
    super.key,
    required DriverAppController controller,
    required super.child,
  }) : super(notifier: controller);

  static DriverAppController of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<DriverAppScope>();
    assert(scope != null, 'DriverAppScope not found in widget tree.');
    return scope!.notifier!;
  }
}
