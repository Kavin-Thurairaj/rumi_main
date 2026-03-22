const http = require('http');

// Make an HTTP request to add test images
const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/rooms/1/images',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const testImages = [
  { imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop' },
  { imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop' },
  { imageUrl: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=800&auto=format&fit=crop' }
];

let completed = 0;

testImages.forEach(img => {
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`Image ${++completed} - Status ${res.statusCode}:`, response);
      } catch(e) {
        console.log(`Image ${++completed} - Status ${res.statusCode}: ${data}`);
      }
      if (completed === testImages.length) {
        console.log('\n✓ All test images processed');
      }
    });
  });

  req.on('error', err => console.error('Error:', err.message));
  req.write(JSON.stringify(img));
  req.end();
});
