const http = require('http');
const fs = require('fs');
const path = require('path');

// Test data
const testRoom = {
  roomTitle: 'Test Room ' + Date.now(),
  roomDescription: 'This is a test room for debugging image uploads',
  genderAllowed: 'OTHER',
  maxRoommates: 1,
  roomStatus: 'AVAILABLE',
  roomType: 'STUDIO',
  address: {
    houseNumber: 123,
    addressLine: 'Test Street',
    city: 'TestCity',
    country: 'TestCountry'
  },
  price: {
    amount: 50000,
    advance: 10000,
    billingCycle: 'MONTHLY'
  },
  amenityIds: [],
  ruleIds: [],
  paymentConditionIds: []
};

// Mock auth token - using a test token
// In production, this would come from Supabase auth
const mockAuthToken = 'test-token-' + Date.now();

function makeRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : data,
            rawBody: data
          });
        } catch(e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: null,
            rawBody: data
          });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function testImageUpload() {
  console.log('\n🧪 Starting Image Upload Test\n');
  
  try {
    // Step 1: Test backend connectivity
    console.log('1️⃣ Testing backend connectivity...');
    const pingRes = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/api/rooms',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (pingRes.status !== 200) {
      console.log('❌ Backend not responding properly');
      console.log('   Status:', pingRes.status);
      return;
    }
    console.log('✅ Backend is responding\n');

    // Step 2: Try creating a room without auth (should fail)
    console.log('2️⃣ Attempting to create room without auth...');
    const createNoAuthRes = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/api/rooms',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testRoom);
    
    console.log('   Status:', createNoAuthRes.status);
    console.log('   Response:', createNoAuthRes.body || createNoAuthRes.rawBody);
    console.log('   ✓ Expected this to fail (no auth)\n');

    // Step 3: Try creating a room WITH auth header (but fake token)
    console.log('3️⃣ Attempting to create room with fake auth token...');
    const createWithAuthRes = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/api/rooms',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockAuthToken}`
      }
    }, testRoom);
    
    console.log('   Status:', createWithAuthRes.status);
    console.log('   Response:', createWithAuthRes.body || createWithAuthRes.rawBody);
    console.log('   (This shows what auth error we get)\n');

    // Step 4: Check what the image upload endpoint expects
    console.log('4️⃣ Attempting to upload image to room 1 with fake token...');
    
    // Create a minimal multipart form-data request
    const boundary = '----FormBoundary' + Date.now();
    const fileContent = 'fake image content';
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="image"; filename="test.jpg"\r\n`;
    body += `Content-Type: image/jpeg\r\n\r\n`;
    body += fileContent + '\r\n';
    body += `--${boundary}--\r\n`;

    const uploadRes = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/api/rooms/1/images',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Authorization': `Bearer ${mockAuthToken}`
      }
    }, body);
    
    console.log('   Status:', uploadRes.status);
    console.log('   Response:', uploadRes.body || uploadRes.rawBody);
    console.log('   ✓ This is the error we need to fix!\n');

    // Step 5: Summary
    console.log('📊 Summary:');
    console.log('   - Backend is: ' + (pingRes.status === 200 ? '✅ Running' : '❌ Not responding'));
    console.log('   - Auth required: ' + (createNoAuthRes.status === 401 ? '✅ Yes (401 Unauthorized)' : 'Check status ' + createNoAuthRes.status));
    console.log('   - Fake token error: ' + (createWithAuthRes.body?.error ? createWithAuthRes.body.error : 'See above'));
    console.log('   - Image upload with fake token error: ' + (uploadRes.body?.error ? uploadRes.body.error : uploadRes.rawBody));

  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testImageUpload();
