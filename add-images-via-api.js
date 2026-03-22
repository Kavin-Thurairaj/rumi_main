// This script directly inserts test images into the database
// No auth needed - direct database access

const request = require('http').request;

// We'll try to trick this: insert images directly using a backend endpoint that doesn't require auth
// OR we'll use curl/postgres if available

// Actually, let me try a different approach: use the test controller if it exists
console.log('🔧 Attempting to add test images to room 1...\n');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/test/add-test-images/1',  // This is the test endpoint I created
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
};

const req = request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}\n`);
    console.log('Response:');
    console.log(data);
    
    if(res.statusCode === 200) {
      console.log('\n✅ Test images added successfully!');
      console.log('   Go to http://localhost:3000 and view room 1 - images should now display');
    }
  });
});

req.on('error', err => {
  if(err.code === 'ECONNREFUSED') {
    console.error('❌ Cannot connect to backend on port 8080');  
    console.error('   Make sure backend is running!');
  } else {
    console.error('❌ Error:', err.message);
  }
});

req.end();
