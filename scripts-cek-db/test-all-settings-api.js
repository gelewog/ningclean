/**
 * Test semua Settings API Endpoints
 */

const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 4000;
const ADMIN_EMAIL = 'admin@ningclean.com';
const ADMIN_PASSWORD = 'admin123';

let authToken = null;

function apiRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: `/api${path}`,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); } 
        catch (e) { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function login() {
  console.log('🔑 Login...');
  const result = await apiRequest('/auth/login', 'POST', { 
    email: ADMIN_EMAIL, 
    password: ADMIN_PASSWORD 
  });
  if (result.data?.access_token) {
    authToken = result.data.access_token;
    console.log('✅ Login OK\n');
    return true;
  }
  console.log('❌ Login gagal:', result.data, '\n');
  return false;
}

async function testEndpoint(name, path, method = 'GET', data = null) {
  console.log(`📡 ${method} ${path}`);
  const result = await apiRequest(path, method, data, authToken);
  const status = result.status === 200 ? '✅' : '❌';
  console.log(`   ${status} Status: ${result.status}`);
  if (result.status === 200) {
    console.log(`   Data keys: ${Object.keys(result.data || {}).join(', ') || 'empty'}`);
  } else {
    console.log(`   Error: ${JSON.stringify(result.data).substring(0, 100)}`);
  }
  console.log();
  return result.status === 200;
}

async function runTests() {
  console.log('========================================');
  console.log('TEST ALL SETTINGS API ENDPOINTS');
  console.log('========================================\n');

  if (!await login()) return;

  let passed = 0, total = 0;

  // Site Settings
  console.log('=== Site Settings ===');
  total++; if (await testEndpoint('SiteSettings GET', '/site-settings')) passed++;

  // Notifications
  console.log('=== Notifications ===');
  total++; if (await testEndpoint('Notifications GET', '/notifications/settings/flat')) passed++;

  // Navigation
  console.log('=== Navigation ===');
  total++; if (await testEndpoint('Navigation GET', '/navigation-settings')) passed++;

  // Homepage
  console.log('=== Homepage ===');
  total++; if (await testEndpoint('Homepage GET', '/homepage-settings')) passed++;

  // Footer
  console.log('=== Footer ===');
  total++; if (await testEndpoint('Footer GET', '/footer-settings')) passed++;

  // Summary
  console.log('========================================');
  console.log(`RESULT: ${passed}/${total} tests passed`);
  console.log('========================================\n');
}

runTests().catch(console.error);