/**
 * Script untuk test endpoint API notifications
 * Run: node scripts-cek-db/test-api-endpoints.js
 * 
 * Pastikan API server sedang berjalan di http://localhost:4000
 */

const http = require('http');

function makeRequest(path, method = 'GET', token = null, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
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

async function testEndpoints() {
  console.log('========================================');
  console.log('TEST NOTIFICATIONS API ENDPOINTS');
  console.log('========================================\n');

  const testToken = process.env.TEST_TOKEN || 'your-admin-token-here';

  try {
    // Test GET /notifications/settings (JSONB format)
    console.log('1. Testing GET /notifications/settings');
    try {
      const result = await makeRequest('/notifications/settings', 'GET', testToken);
      console.log('   Status:', result.status);
      console.log('   Response:', JSON.stringify(result.data, null, 2).substring(0, 500) + '...\n');
    } catch (e) {
      console.log('   Error:', e.message, '\n');
    }

    // Test GET /notifications/settings/flat (Flat format)
    console.log('2. Testing GET /notifications/settings/flat');
    try {
      const result = await makeRequest('/notifications/settings/flat', 'GET', testToken);
      console.log('   Status:', result.status);
      console.log('   Response Keys:', Object.keys(result.data || {}).join(', '));
      console.log('   Full Response:', JSON.stringify(result.data, null, 2), '\n');
    } catch (e) {
      console.log('   Error:', e.message, '\n');
    }

    // Test PUT /notifications/settings/flat
    console.log('3. Testing PUT /notifications/settings/flat (update test)');
    try {
      const testData = {
        whatsappNumber: '6281234567890',
        whatsappMessage: 'Test message',
        whatsappEnabled: true
      };
      const result = await makeRequest('/notifications/settings/flat', 'PUT', testToken, testData);
      console.log('   Status:', result.status);
      console.log('   Response:', JSON.stringify(result.data, null, 2), '\n');
    } catch (e) {
      console.log('   Error:', e.message, '\n');
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }

  console.log('========================================');
  console.log('TEST COMPLETE');
  console.log('========================================\n');
}

testEndpoints();
