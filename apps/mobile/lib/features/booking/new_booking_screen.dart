import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_strings.dart';
import '../../core/constants/app_colors.dart';

class NewBookingScreen extends StatefulWidget {
  const NewBookingScreen({super.key});

  @override
  State<NewBookingScreen> createState() => _NewBookingScreenState();
}

class _NewBookingScreenState extends State<NewBookingScreen> {
  int _currentStep = 0;
  
  // Form Controllers (placeholders)
  final _addressController = TextEditingController();
  final _notesController = TextEditingController();
  
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  TimeOfDay _selectedTime = const TimeOfDay(hour: 10, minute: 0);

  @override
  void dispose() {
    _addressController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.newBooking),
      ),
      body: Stepper(
        currentStep: _currentStep,
        onStepContinue: _onStepContinue,
        onStepCancel: _onStepCancel,
        controlsBuilder: (context, details) {
          return Padding(
            padding: const EdgeInsets.only(top: 16),
            child: Row(
              children: [
                ElevatedButton(
                  onPressed: details.onStepContinue,
                  child: Text(_currentStep == 2 ? AppStrings.confirmBooking : AppStrings.next),
                ),
                if (_currentStep > 0) ...[
                  const SizedBox(width: 12),
                  TextButton(
                    onPressed: details.onStepCancel,
                    child: const Text(AppStrings.back),
                  ),
                ],
              ],
            ),
          );
        },
        steps: [
          Step(
            title: const Text(AppStrings.selectService),
            content: _buildServiceSelection(),
            isActive: _currentStep >= 0,
            state: _currentStep > 0 ? StepState.complete : StepState.indexed,
          ),
          Step(
            title: const Text(AppStrings.selectDateTime),
            content: _buildDateTimeSelection(),
            isActive: _currentStep >= 1,
            state: _currentStep > 1 ? StepState.complete : StepState.indexed,
          ),
          Step(
            title: const Text(AppStrings.pickupAddress),
            content: _buildAddressInput(),
            isActive: _currentStep >= 2,
            state: _currentStep > 2 ? StepState.complete : StepState.indexed,
          ),
        ],
      ),
    );
  }

  Widget _buildServiceSelection() {
    // Placeholder services - replace with Bloc/Provider
    final services = List.generate(4, (i) => {'name': 'Layanan ${i + 1}', 'price': 'Rp ${(i + 1) * 15000}'});

    return Column(
      children: services.map((service) {
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.local_laundry_service, color: AppColors.primary),
            ),
            title: Text(service['name']!),
            subtitle: Text(service['price']!),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: Select service
            },
          ),
        );
      }).toList(),
    );
  }

  Widget _buildDateTimeSelection() {
    return Column(
      children: [
        // Date Picker
        Card(
          child: ListTile(
            leading: const Icon(Icons.calendar_today, color: AppColors.primary),
            title: const Text('Tanggal'),
            subtitle: Text(_formatDate(_selectedDate)),
            trailing: const Icon(Icons.chevron_right),
            onTap: () async {
              final date = await showDatePicker(
                context: context,
                initialDate: _selectedDate,
                firstDate: DateTime.now(),
                lastDate: DateTime.now().add(const Duration(days: 30)),
              );
              if (date != null) {
                setState(() => _selectedDate = date);
              }
            },
          ),
        ),
        const SizedBox(height: 8),
        // Time Picker
        Card(
          child: ListTile(
            leading: const Icon(Icons.access_time, color: AppColors.primary),
            title: const Text('Waktu'),
            subtitle: Text(_selectedTime.format(context)),
            trailing: const Icon(Icons.chevron_right),
            onTap: () async {
              final time = await showTimePicker(
                context: context,
                initialTime: _selectedTime,
              );
              if (time != null) {
                setState(() => _selectedTime = time);
              }
            },
          ),
        ),
      ],
    );
  }

  Widget _buildAddressInput() {
    return Column(
      children: [
        TextField(
          controller: _addressController,
          maxLines: 3,
          decoration: const InputDecoration(
            labelText: AppStrings.pickupAddress,
            hintText: 'Masukkan alamat lengkap untuk penjemputan',
            prefixIcon: Icon(Icons.location_on_outlined),
          ),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _notesController,
          maxLines: 2,
          decoration: const InputDecoration(
            labelText: AppStrings.notes,
            hintText: 'Catatan tambahan (opsional)',
            prefixIcon: Icon(Icons.note_outlined),
          ),
        ),
        const SizedBox(height: 24),
        // Summary Card
        Card(
          color: AppColors.primary.withOpacity(0.05),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  AppStrings.bookingSummary,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const Divider(),
                _buildSummaryRow('Layanan', 'Laundry Kiloan'),
                _buildSummaryRow('Tanggal', _formatDate(_selectedDate)),
                _buildSummaryRow('Waktu', _selectedTime.format(context)),
                _buildSummaryRow('Alamat', _addressController.text.isNotEmpty 
                    ? '${_addressController.text.substring(0, _addressController.text.length > 20 ? 20 : _addressController.text.length)}...' 
                    : '-'),
                const Divider(),
                _buildSummaryRow(AppStrings.totalAmount, 'Rp 25.000', isBold: true),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontWeight: isBold ? FontWeight.bold : FontWeight.normal)),
          Text(value, style: TextStyle(fontWeight: isBold ? FontWeight.bold : FontWeight.normal, color: isBold ? AppColors.primary : null)),
        ],
      ),
    );
  }

  void _onStepContinue() {
    if (_currentStep < 2) {
      setState(() => _currentStep++);
    } else {
      _submitBooking();
    }
  }

  void _onStepCancel() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    } else {
      context.pop();
    }
  }

  void _submitBooking() {
    // TODO: Submit booking via repository
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Booking berhasil!')),
    );
    context.go('/bookings');
  }

  String _formatDate(DateTime date) {
    final months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }
}
