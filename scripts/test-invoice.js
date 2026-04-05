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
  
  // Test invoice template
  const templateRes = await fetch('http://localhost:4000/api/invoices/template', {
    headers: {Authorization: 'Bearer ' + token}
  });
  const template = await templateRes.json();
  console.log('Invoice Template:', JSON.stringify(template, null, 2));
}

test().catch(console.error);
