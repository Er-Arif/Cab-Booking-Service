import 'package:flutter/widgets.dart';

import '../state/customer_app_controller.dart';

class CustomerAppScope extends InheritedNotifier<CustomerAppController> {
  const CustomerAppScope({
    super.key,
    required CustomerAppController controller,
    required super.child,
  }) : super(notifier: controller);

  static CustomerAppController of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<CustomerAppScope>();
    assert(scope != null, 'CustomerAppScope not found in widget tree.');
    return scope!.notifier!;
  }
}
