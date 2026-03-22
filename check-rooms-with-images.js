const http = require('http');

async function testRooms() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/rooms',
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          let rooms = Array.isArray(json) ? json : json.content || json.data || [];
          
          console.log('Total rooms found:', rooms.length);
          console.log('\n🔍 Checking which rooms have images...\n');
          
          // For each room, fetch images
          let imageCount = 0;
          rooms.slice(0, 5).forEach(room => {
            const roomId = room.roomId || room.id;
            if (!roomId) return;
            
            const imgOptions = {
              hostname: 'localhost',
              port: 8080,
              path: `/api/rooms/${roomId}/images`,
              method: 'GET',
            };
            
            const imgReq = http.request(imgOptions, (imgRes) => {
              let imgData = '';
              imgRes.on('data', chunk => imgData += chunk);
              imgRes.on('end', () => {
                try {
                  const images = JSON.parse(imgData);
                  const count = Array.isArray(images) ? images.length : 0;
                  if (count > 0) {
                    imageCount++;
                    console.log(`✅ Room ${roomId}: ${count} image(s)`);
                    if (Array.isArray(images) && images[0]) {
                      console.log(`   URL: ${images[0].imageUrl?.substring(0, 80)}...`);
                    }
                  } else {
                    console.log(`❌ Room ${roomId}: NO images`);
                  }
                } catch(e) {
                  console.log(`❌ Room ${roomId}: Error parsing images`);
                }
              });
            });
            imgReq.on('error', () => {});
            imgReq.end();
          });
          
          resolve();
        } catch (err) {
          console.error('Failed to parse rooms:', err.message);
          resolve();
        }
      });
    });
    
    req.on('error', () => console.error('Connection error'));
    req.end();
  });
}

testRooms();
