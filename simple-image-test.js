const http = require('http');

// Simple test: try uploading an image to room 1 with a fake auth token
const boundary = '----FormBoundary' + Date.now();

// Fake image data
const fileContent = 'fake image content';
let body = '';
body += `--${boundary}\r\n`;
body += `Content-Disposition: form-data; name="image"; filename="test.jpg"\r\n`;
body += `Content-Type: image/jpeg\r\n\r\n`;
body += fileContent + '\r\n';
body += `--${boundary}--\r\n`;

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/rooms/1/images',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Authorization': 'Bearer fake-test-token-12345',
    'Content-Length': Buffer.byteLength(body)
  }
};

console.log('🧪 Testing image upload to room 1...\n');
console.log('📤 Sending POST /api/rooms/1/images');
console.log('🔑 Auth header: Bearer fake-test-token-12345\n');

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}\n`);
    
    try {
      const json = JSON.parse(data);
      console.log('❌ ERROR RESPONSE:');
      console.log(JSON.stringify(json, null, 2));
    } catch(e) {
      console.log('Raw response:');
      console.log(data);
    }
  });
});

req.on('error', err => {
  console.error('❌ Connection error:', err.message);
});

req.write(body);
req.end();
