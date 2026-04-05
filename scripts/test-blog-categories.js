const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function test() {
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'admin@ningclean.com', password: 'admin123'})
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token;
  
  // Test blog categories GET
  const res = await fetch('http://localhost:4000/api/blog-categories', {
    headers: {Authorization: 'Bearer ' + token}
  });
  const data = await res.json();
  console.log('Blog Categories:', JSON.stringify(data, null, 2));
  
  // Create a category
  const createRes = await fetch('http://localhost:4000/api/blog-categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({name: 'Tips Kebersihan', slug: 'tips-kebersihan', description: 'Tips dan trik kebersihan rumah'})
  });
  const created = await createRes.json();
  console.log('Created:', JSON.stringify(created, null, 2));
}

test().catch(console.error);
