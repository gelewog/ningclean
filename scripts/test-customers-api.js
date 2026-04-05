const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function test() {
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'admin@ningclean.com', password: 'admin123'})
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token;
  console.log('Token obtained');
  
  // Test admin customers endpoint
  const usersRes = await fetch('http://localhost:4000/api/admin/customers', {
    headers: {Authorization: 'Bearer ' + token}
  });
  const customers = await usersRes.json();
  console.log('\n=== Admin API: /admin/customers ===');
  console.log(JSON.stringify(customers, null, 2));
}

test().catch(console.error);
