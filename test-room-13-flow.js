const http = require('http');

// Test /rooms/search endpoint
console.log('Testing /api/rooms/search endpoint...\n');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/rooms/search?limit=5',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const rooms = Array.isArray(json) ? json : json.content || [];
      
      console.log('\nRooms found:', rooms.length);
      
      if (rooms.length > 0) {
        console.log('\nFirst room:');
        console.log('  ID:', rooms[0].roomId);
        console.log('  Title:', rooms[0].roomTitle);
        console.log('  City:', rooms[0].city);
      }
      
      // Now test /rooms/{id} endpoint with room 13
      console.log('\n\n--- Testing /api/rooms/13 ---');
      const room13Options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/rooms/13',
        method: 'GET',
      };
      
      const room13Req = http.request(room13Options, (room13Res) => {
        let room13Data = '';
        room13Res.on('data', chunk => room13Data += chunk);
        room13Res.on('end', () => {
          try {
            const room = JSON.parse(room13Data);
            console.log('Room 13 found!');
            console.log('  Title:', room.roomTitle);
            console.log('  Status:', room.roomStatus);
            
            // Now fetch its images
            console.log('\n--- Fetching images for room 13 ---');
            const imgOptions = {
              hostname: 'localhost',
              port: 8080,
              path: '/api/rooms/13/images',
              method: 'GET',
            };
            
            const imgReq = http.request(imgOptions, (imgRes) => {
              let imgData = '';
              imgRes.on('data', chunk => imgData += chunk);
              imgRes.on('end', () => {
                const images = JSON.parse(imgData);
                console.log('Images:', images.length);
                if (images.length > 0) {
                  console.log('  Image URL:', images[0].imageUrl?.substring(0, 100) + '...');
                }
              });
            });
            imgReq.end();
            
          } catch(e) {
            console.log('Error:', e.message);
            console.log('Response:', room13Data.substring(0, 200));
          }
        });
      });
      
      room13Req.end();
      
    } catch (err) {
      console.error('Error:', err.message);
      console.log('Response:', data.substring(0, 300));
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.end();
