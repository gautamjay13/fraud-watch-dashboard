// Simple test script to verify backend is running
// Run with: node test-server.js

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('✅ Backend is running correctly!');
    } else {
      console.log('❌ Backend returned an error');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Cannot connect to backend:', error.message);
  console.log('Make sure the backend server is running with: npm run dev');
});

req.end();
