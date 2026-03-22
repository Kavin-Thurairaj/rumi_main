#!/usr/bin/env node

/**
 * Test script for room posting API
 * Run: node test-room-api.js [supabase_jwt_token]
 * 
 * To get a real token:
 * 1. Log in to your app at http://localhost:3000
 * 2. Open Dev Tools > Console
 * 3. Paste: const { data: { session } } = await supabase.auth.getSession(); console.log(session.access_token)
 * 4. Copy the token and run: node test-room-api.js "YOUR_TOKEN_HERE"
 */

const http = require('http');

// Get token from command line arg or use dummy for demo
let authToken = process.argv[2] ? `Bearer ${process.argv[2]}` : "Bearer demo-token";

if (process.argv[2]) {
  console.log('✅ Using provided Supabase token\n');
} else {
  console.log('⚠️  Using demo token (will likely fail auth)\n');
  console.log('📝 To test with real auth:');
  console.log('   1. Log in at http://localhost:3000');
  console.log('   2. Open browser console');
  console.log('   3. Run: const {data:{session}}=await supabase.auth.getSession();console.log(session.access_token)');
  console.log('   4. Then run: node test-room-api.js "YOUR_TOKEN_HERE"\n');
}

// Minimal test room payload
const testRoom = {
  roomTitle: "Test Room " + new Date().getTime(),
  roomDescription: "A test room to verify API works",
  genderAllowed: "FEMALE",
  maxRoommates: 2,
  roomStatus: "AVAILABLE",
  roomType: "STUDIO",
  address: {
    houseNumber: 123,
    addressLine: "Main St",
    city: "Colombo",
    country: "Sri Lanka",
    mapUrl: "https://maps.google.com"
  },
  price: {
    amount: 10000,
    advance: 2000,
    billingCycle: "MONTHLY"
  },
  amenityIds: [],
  ruleIds: [],
  paymentConditionIds: []
};

const postData = JSON.stringify(testRoom);

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/rooms',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Authorization': authToken
  }
};

console.log('🧪 Testing Room Creation API...\n');
console.log('📤 POST http://localhost:8080/api/rooms');
console.log('📝 Payload:', testRoom.roomTitle + '...');
console.log('🔑 Auth: ' + (authToken.startsWith('Bearer test-') || authToken === 'Bearer demo-token' ? 'DUMMY (will fail)' : 'REAL'));
console.log('\n⏳ Sending request...\n');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`📍 Status Code: ${res.statusCode}`);
    console.log('📬 Response Headers:', Object.entries(res.headers).filter(([k]) => k.includes('content')));
    console.log('📋 Response Body:');
    
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
      
      if (res.statusCode === 201) {
        console.log('\n✅ SUCCESS! Room created with ID:', json.roomId);
      } else if (res.statusCode === 400) {
        console.log('\n❌ VALIDATION ERROR:', json.error || 'Bad request');
      } else if (res.statusCode === 401 || res.statusCode === 403) {
        console.log('\n🔒 AUTH ERROR - Need valid Supabase token');
        console.log('   See instructions above');
      } else {
        console.log('\n❌ ERROR:', json.error || 'Unknown error');
      }
    } catch (e) {
      console.log(data);
      console.log('\n⚠️ Could not parse JSON response');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.error('\n💡 Make sure:');
  console.error('   1. Backend is running on port 8080');
  console.error('   2. Run: java -jar rumi_backend_v2/target/rumi_backend_v2-0.0.1-SNAPSHOT.jar');
  process.exit(1);
});

req.write(postData);
req.end();
