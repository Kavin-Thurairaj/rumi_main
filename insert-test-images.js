// Simple test to add images directly to room 1 via direct SQL
const { execSync } = require('child_process');
const fs = require('fs');

const sqlStatements = `
INSERT INTO room_image (room_id, image_url) VALUES 
  (1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop'),
  (1, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop'),
  (1, 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=800&auto=format&fit=crop');

SELECT COUNT(*) as total_images FROM room_image WHERE room_id = 1;
`;

// Write to a temp file
fs.writeFileSync('temp.sql', sqlStatements);

const connStr = 'postgresql://postgres.uuicntunejvvwzfcypey:Y3T9VnHSMZIoQ29j@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

try {
  const result = execSync(`psql "${connStr}" -f temp.sql 2>&1`).toString();
  console.log('Database update result:');
  console.log(result);
} catch(e) {
  console.error('Error:', e.message);
}

// Cleanup
fs.unlinkSync('temp.sql');
