const fetch = require('node-fetch');

async function test() {
  // Login as admin
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ningclean.com', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token;
  console.log('Token:', token ? 'obtained' : 'MISSING');

  // Test users endpoint
  const usersRes = await fetch('http://localhost:4000/api/admin/users', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log('\n=== /api/admin/users ===');
  console.log('Status:', usersRes.status);
  const users = await usersRes.json();
  console.log('Data:', JSON.stringify(users, null, 2));
}

test().catch(console.error);
