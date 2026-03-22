const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/rooms',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('\nRaw response (first 500 chars):');
    console.log(data.substring(0, 500));
    console.log('\n...\n');
    
    try {
      const json = JSON.parse(data);
      console.log('Parsed JSON (first 300 chars):');
      console.log(JSON.stringify(json, null, 2).substring(0, 300));
    } catch(e) {
      console.log('Not JSON:', e.message);
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.end();
