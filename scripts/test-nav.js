const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function test() {
  // Get token
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'admin@ningclean.com', password: 'admin123'})
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token;
  console.log('Token obtained');
  
  // Test navigation settings GET
  const res = await fetch('http://localhost:4000/api/navigation-settings', {
    headers: {Authorization: 'Bearer ' + token}
  });
  const data = await res.json();
  console.log('Navigation Settings:', JSON.stringify(data, null, 2));
}

test().catch(console.error);
