import 'package:flutter/material.dart';

import '../../app/customer_app_scope.dart';

class CustomerProfileScreen extends StatefulWidget {
  const CustomerProfileScreen({
    super.key,
    required this.onLogout,
  });

  final Future<void> Function() onLogout;

  @override
  State<CustomerProfileScreen> createState() => _CustomerProfileScreenState();
}

class _CustomerProfileScreenState extends State<CustomerProfileScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _emergencyContactController = TextEditingController();
  String _preferredPaymentMethod = 'cash';
  String? _loadedProfileId;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _emergencyContactController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = CustomerAppScope.of(context);
    final profile = controller.profile;

    if (profile != null && _loadedProfileId != profile.id) {
      _loadedProfileId = profile.id;
      _nameController.text = profile.name;
      _emailController.text = profile.email ?? '';
      _emergencyContactController.text = profile.emergencyContact ?? '';
      _preferredPaymentMethod = profile.preferredPaymentMethod ?? 'cash';
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Account details',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _nameController,
                    decoration: const InputDecoration(labelText: 'Full name'),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _emailController,
                    decoration: const InputDecoration(labelText: 'Email'),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _emergencyContactController,
                    decoration: const InputDecoration(labelText: 'Emergency contact'),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: _preferredPaymentMethod,
                    decoration: const InputDecoration(labelText: 'Preferred payment method'),
                    items: const [
                      DropdownMenuItem(value: 'cash', child: Text('Cash')),
                      DropdownMenuItem(value: 'upi', child: Text('UPI')),
                    ],
                    onChanged: (value) {
                      if (value == null) {
                        return;
                      }
                      setState(() {
                        _preferredPaymentMethod = value;
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  Text('Phone: ${profile?.phone ?? controller.session?.phone ?? 'Unknown'}'),
                  Text('User ID: ${controller.session?.userId ?? 'Unknown'}'),
                  const SizedBox(height: 16),
                  if (controller.feedbackMessage != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Text(
                        controller.feedbackMessage!,
                        style: const TextStyle(color: Color(0xFF245B37)),
                      ),
                    ),
                  if (controller.errorMessage != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Text(
                        controller.errorMessage!,
                        style: const TextStyle(color: Color(0xFFB23A2F)),
                      ),
                    ),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      FilledButton(
                        onPressed: controller.isSavingProfile
                            ? null
                            : () {
                                controller.saveProfile(
                                  name: _nameController.text,
                                  email: _emailController.text,
                                  emergencyContact: _emergencyContactController.text,
                                  preferredPaymentMethod: _preferredPaymentMethod,
                                );
                              },
                        child: const Text('Save profile'),
                      ),
                      OutlinedButton(
                        onPressed: () => controller.refreshData(showLoader: true),
                        child: const Text('Refresh'),
                      ),
                      OutlinedButton(
                        onPressed: () {
                          widget.onLogout();
                        },
                        child: const Text('Logout'),
                      ),
                    ],
                  ),
                  if (controller.isSavingProfile) ...[
                    const SizedBox(height: 16),
                    const LinearProgressIndicator(),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
