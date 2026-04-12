/**
 * Test API Notification Settings dengan Login
 */

const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 4000;

// Default admin credentials
const ADMIN_EMAIL = 'admin@ningclean.com'; // Ganti dengan email admin yang valid
const ADMIN_PASSWORD = 'admin123'; // Ganti dengan password admin yang valid

let authToken = null;

function apiRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

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
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function login() {
  console.log('🔑 Logging in...');
  try {
    const result = await apiRequest('/auth/login', 'POST', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    console.log('Login Status:', result.status);
    
    if (result.data && result.data.access_token) {
      authToken = result.data.access_token;
      console.log('✅ Login successful!');
      console.log('Token:', authToken.substring(0, 50) + '...');
      return true;
    } else {
      console.log('❌ Login failed:', result.data);
      return false;
    }
  } catch (error) {
    console.error('Login error:', error.message);
    return false;
  }
}

async function runTest() {
  console.log('========================================');
  console.log('TEST API NOTIFICATION SETTINGS (AUTH)');
  console.log('========================================\n');

  // Step 1: Login
  const loggedIn = await login();
  if (!loggedIn) {
    console.log('\n❌ Cannot proceed without authentication');
    console.log('Pastikan admin credentials benar di script');
    return;
  }

  try {
    // Step 2: Get current settings
    console.log('\n=== STEP 2: Get Current Settings ===');
    const getResult = await apiRequest('/notifications/settings/flat', 'GET', null, authToken);
    console.log('Status:', getResult.status);
    if (getResult.status === 200) {
      console.log('Current Data:', JSON.stringify(getResult.data, null, 2));
    } else {
      console.log('Error:', getResult.data);
    }

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

    console.log('📤 Sending update...');
    const updateResult = await apiRequest('/notifications/settings/flat', 'PUT', updateData, authToken);
    console.log('Status:', updateResult.status);
    console.log('Update Result:', JSON.stringify(updateResult.data, null, 2));

    // Step 4: Verify update
    console.log('\n=== STEP 4: Verify Update ===');
    const verifyResult = await apiRequest('/notifications/settings/flat', 'GET', null, authToken);
    console.log('Status:', verifyResult.status);
    if (verifyResult.status === 200) {
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
        console.log('❌ Email User mismatch:', verifyResult.data?.emailUser);
      }

      if (verifyResult.data && verifyResult.data.hasPassword === true) {
        console.log('✅ Has Password: TRUE');
      } else {
        console.log('❌ Has Password: FALSE (expected TRUE)');
      }

      console.log('\n========================================');
      console.log('✅ API TEST COMPLETE');
      console.log('========================================');
    } else {
      console.log('Error:', verifyResult.data);
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  }
}

runTest();