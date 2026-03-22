import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://uuicntunejvvwzfcypey.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aWNudHVuZWp2dnd6ZmN5cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNDUwNzUsImV4cCI6MjA4NzgyMTA3NX0.DFe1MmDwn7HOxyvvfmOKF8AvzBTKZMQsrBP9YhD1UX0';
const BACKEND_URL = 'http://127.0.0.1:8080';

async function testFlow() {
  try {
    console.log('🧪 Starting Real Image Upload Test Flow\n');

    // Step 1: Check if backend is running
    console.log('1️⃣ Checking backend connectivity...');
    try {
      const response = await fetch(`${BACKEND_URL}/api/rooms`);
      if (!response.ok) throw new Error('Backend not responding');
      console.log('✅ Backend is running\n');
    } catch (err) {
      console.error('❌ Backend not running at', BACKEND_URL);
      console.error('   Error:', err.message);
      process.exit(1);
    }

    // Step 2: Sign up a test user
    console.log('2️⃣ Signing up test user...');
    const testEmail = `test-${Date.now()}@test.com`;
    const testPassword = 'TestPassword123!';
    
    let signupResponse;
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');
      
      signupResponse = data;
      console.log('✅ User signed up:', testEmail);
      const token = signupResponse.session.access_token;
      console.log('   Token:', token.substring(0, 50) + '...\n');
    } catch (err) {
      console.error('❌ Signup failed:', err.message);
      process.exit(1);
    }

    const authToken = signupResponse.session.access_token;

    // Step 3: Create a test room
    console.log('3️⃣ Creating test room...');
    let roomResponse;
    try {
      const response = await fetch(`${BACKEND_URL}/api/rooms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: 'Test Address 123',
          area: 20,
          category: 'Private Room',
          city: 'Test City',
          description: 'Test room description',
          internet: true,
          price: 500,
          title: 'Test Room - ' + Date.now()
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Room creation failed');
      }
      
      roomResponse = data;
      console.log('✅ Room created, ID:', roomResponse.id);
      console.log('   Address:', roomResponse.address, '\n');
    } catch (err) {
      console.error('❌ Room creation failed:', err.message);
      process.exit(1);
    }

    const roomId = roomResponse.id;

    // Step 4: Create a simple test image
    console.log('4️⃣ Creating test image file...');
    const imagePath = path.join(__dirname, 'test-image-' + Date.now() + '.txt');
    writeFileSync(imagePath, 'This is a test image content');
    console.log('✅ Test image created\n');

    // Step 5: Try to upload an image
    console.log('5️⃣ Attempting to upload image...');
    console.log('   Room ID:', roomId);
    console.log('   Auth Token:', authToken.substring(0, 50) + '...');
    
    try {
      // Read file and create FormData
      const fileBuffer = readFileSync(imagePath);
      const formData = new FormData();
      formData.append('file', new Blob([fileBuffer], { type: 'text/plain' }), 'test-image.txt');

      const response = await fetch(
        `${BACKEND_URL}/api/rooms/${roomId}/images`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          body: formData
        }
      );

      const responseData = await response.json().catch(() => ({ error: 'Could not parse response' }));
      
      if (!response.ok) {
        console.error('❌ Image upload failed!');
        console.error('   Status Code:', response.status);
        console.error('   Response Data:', JSON.stringify(responseData, null, 2));
        
        if (responseData?.error) {
          console.error('\n📋 Backend Error Message:');
          console.error('   ', responseData.error);
        }
      } else {
        console.log('✅ Image uploaded successfully!');
        console.log('   URL:', responseData.imageUrl, '\n');
      }
    } catch (err) {
      console.error('❌ Request failed!');
      console.error('   Error:', err.message);
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testFlow();
