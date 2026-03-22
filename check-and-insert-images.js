// Direct database insert using SQL query
// This bypasses the API and inserts images directly into the database

const http = require('http');

const sqlQuery = `
INSERT INTO public.room_image (room_id, image_url) VALUES
  (1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop'),
  (1, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop'),
  (1, 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=800&auto=format&fit=crop')
ON CONFLICT DO NOTHING;
`;

console.log('🔧 Inserting test images directly to database...\n');
console.log('Attempting to connect to Supabase PostgreSQL...\n');

// For now, just show what would happen
console.log('SQL that would be executed:');
console.log(sqlQuery);
console.log('\n📝 To execute this, use psql:');
console.log('   psql -h aws-1-ap-southeast-1.pooler.supabase.com -p 6543');
console.log('   -U postgres.uuicntunejvvwzfcypey');
console.log('   -d postgres');
console.log('   -c "' + sqlQuery.replace(/\n/g, ' ') + '"\n');

// Alternatively, verify images via API
console.log('Checking if images exist in database for room 1...\n');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/rooms/1/images',
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const images = JSON.parse(data);
      console.log(`Room 1 currently has: ${images.length} images`);
      if(images.length === 0) {
        console.log('\n❌ NO IMAGES FOUND');
        console.log('   This is why images are not showing!');
        console.log('\n💡 Need to either:');
        console.log('   1. Upload images via LandlordDashboard UI');
        console.log('   2. OR manually insert via SQL');
      } else {
        console.log('\n✅ Found images!');
        images.forEach((img, i) => {
          console.log(`   ${i+1}. ${img.imageUrl.substring(0, 80)}...`);
        });
      }
    } catch(e) {
      console.log('Error parsing response:', data);
    }
  });
});

req.on('error', err => {
  console.error('Error checking backend:', err.message);
});

req.end();
