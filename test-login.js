import axios from 'axios';

async function testLogin(url) {
  console.log(`Testing login at: ${url}`);
  try {
    const res = await axios.post(`${url}/auth/login`, {
      email: 'priya.sharma@gmail.com',
      password: 'password'
    });
    console.log('Success!', res.data.message);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

testLogin('http://localhost:5000/api/v1');
testLogin('https://metro-backend-3t8n.onrender.com/api/v1');
