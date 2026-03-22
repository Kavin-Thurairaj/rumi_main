const http = require('http');

const SUPABASE_URL = 'https://uuicntunejvvwzfcypey.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aWNudHVuZWp2dnd6ZmN5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNDUwNzUsImV4cCI6MjA4NzgyMTA3NX0.DFe1MmDwn7HOxyvvfmOKF8AvzBTKZMQsrBP9YhD1UX0';

async function getAuthToken() {
  console.log('🔐 Getting auth token from Supabase...');
  
  return new Promise((resolve, reject) => {
    const testEmail = `test-${Date.now()}@test.com`;
    const testPassword = 'TestPassword123!';
    
    const urlParts = new URL(SUPABASE_URL);
    const options = {
      hostname: urlParts.hostname,
      port: 443,
      path: '/auth/v1/signup',
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      }
    };

    const https = require('https');
    const payload = JSON.stringify({
      email: testEmail,
      password: testPassword,
    });

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.access_token) {
            console.log('✅ Got token: ' + json.access_token.substring(0, 50) + '...\n');
            resolve(json.access_token);
          } else {
            reject(new Error('Unexpected auth response: ' + JSON.stringify(json)));
          }
        } catch (err) {
          reject(new Error('Failed to parse auth response: ' + err.message + '\n' + data));
        }
      });
    });

    req.on('error', reject);
    req.end(payload);
  });
}

async function createRoom(token) {
  console.log('🏠 Creating test room...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/rooms',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    };

    const payload = JSON.stringify({
      roomTitle: 'Test Room - ' + Date.now(),
      roomDescription: 'Test room for image upload testing',
      genderAllowed: 'FEMALE',
      maxRoommates: 2,
      roomStatus: 'AVAILABLE',
      roomType: 'STUDIO',
      address: {
        houseNumber: 123,
        addressLine: 'Main Street',
        city: 'Test City',
        country: 'Test Country'
      },
      price: {
        amount: 500,
        advance: 100,
        billingCycle: 'MONTHLY'
      },
      amenityIds: [],
      ruleIds: [],
      paymentConditionIds: []
    });

    options.headers['Content-Length'] = Buffer.byteLength(payload);

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('Room Create Response:', JSON.stringify(json, null, 2));
          if (res.statusCode === 200 || res.statusCode === 201) {
            const roomId = json.roomId || json.id || json.data?.id;
            if (roomId) {
              console.log('✅ Room created, ID: ' + roomId + '\n');
              resolve(roomId);
            } else {
              reject(new Error('Room created but no ID in response'));
            }
          } else {
            reject(new Error(`Room creation failed (${res.statusCode}): ` + JSON.stringify(json)));
          }
        } catch (err) {
          reject(new Error('Failed to parse room response: ' + err.message));
        }
      });
    });

    req.on('error', reject);
    req.end(payload);
  });
}

async function uploadImage(roomId, token) {
  console.log('📤 Attempting image upload...');
  console.log('   Room ID: ' + roomId);
  console.log('   Token: ' + token.substring(0, 50) + '...\n');
  
  return new Promise((resolve, reject) => {
    // Create a simple PNG image (small 1x1 pixel image)
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
      0x00, 0x00, 0x03, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00,
      0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    const boundary = '----FormBoundary' + Date.now();
    
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="image"; filename="test.png"\r\n`;
    body += `Content-Type: image/png\r\n\r\n`;
    // Can't properly embed binary data in string, need to do it differently
    
    // Actually, let's construct the body as a buffer
    const boundaryBuffer = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="test.png"\r\nContent-Type: image/png\r\n\r\n`);
    const endBoundaryBuffer = Buffer.from(`\r\n--${boundary}--\r\n`);
    const bodyBuffer = Buffer.concat([boundaryBuffer, pngBuffer, endBoundaryBuffer]);

    const options = {
      hostname: 'localhost',
      port: 8080,
      path: `/api/rooms/${roomId}/images`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Authorization': `Bearer ${token}`,
        'Content-Length': bodyBuffer.length
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}\n`);
        
        try {
          const json = JSON.parse(data);
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ SUCCESS!');
            console.log(JSON.stringify(json, null, 2));
            resolve();
          } else {
            console.log('❌ ERROR RESPONSE:');
            console.log(JSON.stringify(json, null, 2));
            
            if (json.error) {
              console.log('\n📋 Error Message:');
              console.log('   ' + json.error);
            }
            reject(new Error(`Upload failed with status ${res.statusCode}`));
          }
        } catch (err) {
          console.log('❌ Could not parse response as JSON');
          console.log('Raw response:', data.substring(0, 200));
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.end(bodyBuffer);
  });
}

async function main() {
  try {
    console.log('🧪 Full Image Upload Test Flow\n');
    console.log('=====================================\n');
    
    const token = await getAuthToken();
    const roomId = await createRoom(token);
    await uploadImage(roomId, token);
    
    console.log('\n✅ Test complete!');
  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    process.exit(1);
  }
}

main();
