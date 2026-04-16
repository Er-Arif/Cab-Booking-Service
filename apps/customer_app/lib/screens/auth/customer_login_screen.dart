import 'package:flutter/material.dart';

import '../../app/customer_app_scope.dart';

class CustomerLoginScreen extends StatefulWidget {
  const CustomerLoginScreen({super.key});

  @override
  State<CustomerLoginScreen> createState() => _CustomerLoginScreenState();
}

class _CustomerLoginScreenState extends State<CustomerLoginScreen> {
  final _phoneController = TextEditingController(text: '9000000002');
  final _otpController = TextEditingController(text: '123456');

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = CustomerAppScope.of(context);

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
                      'Customer Sign In',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Use the seeded customer number 9000000002 and OTP 123456 to test the full mobile booking flow.',
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
