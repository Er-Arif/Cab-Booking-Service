import 'package:flutter/material.dart';

import '../../app/driver_app_scope.dart';

class DriverLoginScreen extends StatefulWidget {
  const DriverLoginScreen({super.key});

  @override
  State<DriverLoginScreen> createState() => _DriverLoginScreenState();
}

class _DriverLoginScreenState extends State<DriverLoginScreen> {
  final _phoneController = TextEditingController(text: '9000000003');
  final _otpController = TextEditingController(text: '123456');

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = DriverAppScope.of(context);

    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 460),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Driver Sign In',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Use the seeded driver number 9000000003 and OTP 123456 to test the full driver operations flow.',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(
                        labelText: 'Phone number',
                        hintText: 'Enter mobile number',
                      ),
                    ),
                    const SizedBox(height: 12),
                    if (controller.otpRequested) ...[
                      TextField(
                        controller: _otpController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          labelText: 'OTP',
                          hintText: 'Enter OTP',
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text('For local development, the mock OTP is 123456.'),
                    ],
                    if (controller.errorMessage != null) ...[
                      const SizedBox(height: 12),
                      Text(
                        controller.errorMessage!,
                        style: const TextStyle(color: Color(0xFFB23A2F)),
                      ),
                    ],
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: FilledButton(
                            onPressed: controller.isBusy
                                ? null
                                : () {
                                    controller.requestOtp(_phoneController.text.trim());
                                  },
                            child: Text(controller.otpRequested ? 'Resend OTP' : 'Send OTP'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: controller.isBusy || !controller.otpRequested
                                ? null
                                : () {
                                    controller.verifyOtp(
                                      phone: _phoneController.text.trim(),
                                      otp: _otpController.text.trim(),
                                    );
                                  },
                            child: const Text('Verify OTP'),
                          ),
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
            ),
          ),
        ),
      ),
    );
  }
}
