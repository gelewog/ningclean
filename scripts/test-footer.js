const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function test() {
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'admin@ningclean.com', password: 'admin123'})
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token;
  
  const res = await fetch('http://localhost:4000/api/footer-settings', {
    headers: {Authorization: 'Bearer ' + token}
  });
  const data = await res.json();
  console.log('Footer Settings:', JSON.stringify(data, null, 2));
}

test().catch(console.error);
