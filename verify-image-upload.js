const http = require('http');

async function testFetch() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/rooms/13/images',
      method: 'GET',
      headers: {}
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}\n`);
        try {
          const json = JSON.parse(data);
          console.log('✅ Images for Room 13:');
          console.log(JSON.stringify(json, null, 2));
        } catch (err) {
          console.log('Raw response:', data);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

testFetch();
