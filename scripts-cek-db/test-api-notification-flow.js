/**
 * Test API Notification Settings Flow (simulasi admin/settings/notifications)
 * 
 * Flow:
 * 1. Reset ke default (disabled)
 * 2. Get current settings via API
 * 3. Update via API dengan enable email + app password
 * 4. Verify update
 */

const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 4000;
const TEST_TOKEN = process.env.ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-token-for-admin'; // Ganti dengan token admin valid

function apiRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    };

    console.log(`\n📡 ${method} ${path}`);

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      console.log('📤 Request Body:', JSON.stringify(data, null, 2));
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTest() {
  console.log('========================================');
  console.log('TEST API NOTIFICATION SETTINGS FLOW');
  console.log('========================================\n');

  try {
    // Step 1: Get current settings
    console.log('=== STEP 1: Get Current Settings ===');
    const getResult = await apiRequest('/notifications/settings/flat', 'GET');
    console.log('Status:', getResult.status);
    console.log('Current Data:', JSON.stringify(getResult.data, null, 2));

    // Step 2: Reset to default first (disabled state)
    console.log('\n=== STEP 2: Reset to Default (Disabled) ===');
    const resetData = {
      whatsappNumber: '',
      whatsappMessage: '🎉 *Booking Baru!*\n\n📋 *Order:* {orderNumber}',
      whatsappEnabled: false,
      emailEnabled: false,
      emailHost: 'smtp.gmail.com',
      emailPort: 587,
      emailUser: '',
      emailPassword: '',
      emailFrom: 'NingClean <>',
      adminEmail: '',
      twilioAccountSid: '',
      twilioAuthToken: '',
      twilioFromNumber: ''
    };
    
    const resetResult = await apiRequest('/notifications/settings/flat', 'PUT', resetData);
    console.log('Status:', resetResult.status);
    console.log('Reset Result:', JSON.stringify(resetResult.data, null, 2));

    // Step 3: Update dengan enable email + app password (simulasi input di admin)
    console.log('\n=== STEP 3: Update via Admin Panel (Enable Email) ===');
    const updateData = {
      whatsappNumber: '',
      whatsappMessage: '🎉 *Booking Baru!*\n\n📋 *Order:* {orderNumber}',
      whatsappEnabled: false,
      emailEnabled: true,  // ✅ Enable
      emailHost: 'smtp.gmail.com',
      emailPort: 587,
      emailUser: 'kurcool3@gmail.com',  // ✅ Input email
      emailPassword: 'yihxpfpfwehvziqv',  // ✅ Input app password
      emailFrom: 'NingClean <kurcool3@gmail.com>',
      adminEmail: 'kurcool3@gmail.com',
      twilioAccountSid: '',
      twilioAuthToken: '',
      twilioFromNumber: ''
    };

    const updateResult = await apiRequest('/notifications/settings/flat', 'PUT', updateData);
    console.log('Status:', updateResult.status);
    console.log('Update Result:', JSON.stringify(updateResult.data, null, 2));

    // Step 4: Verify update
    console.log('\n=== STEP 4: Verify Update ===');
    const verifyResult = await apiRequest('/notifications/settings/flat', 'GET');
    console.log('Status:', verifyResult.status);
    console.log('Updated Data:', JSON.stringify(verifyResult.data, null, 2));

    // Summary
    console.log('\n========================================');
    console.log('TEST SUMMARY');
    console.log('========================================');
    
    if (verifyResult.data && verifyResult.data.emailEnabled === true) {
      console.log('✅ Email Enabled: TRUE');
    } else {
      console.log('❌ Email Enabled: FALSE (expected TRUE)');
    }

    if (verifyResult.data && verifyResult.data.emailUser === 'kurcool3@gmail.com') {
      console.log('✅ Email User: kurcool3@gmail.com');
    } else {
      console.log('❌ Email User mismatch');
    }

    if (verifyResult.data && verifyResult.data.hasPassword === true) {
      console.log('✅ Has Password: TRUE');
    } else {
      console.log('❌ Has Password: FALSE (expected TRUE)');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\nNote: Pastikan API server berjalan di http://localhost:4000');
    console.log('Jalankan: npm run dev:api');
  }
}

runTest();