#!/bin/bash

# Use psql to connect to Supabase and insert test images directly
export PGPASSWORD="Y3T9VnHSMZIoQ29j"

psql -h aws-1-ap-southeast-1.pooler.supabase.com -p 6543 -U postgres.uuicntunejvvwzfcypey -d postgres << EOF

-- Insert test images for room 1
INSERT INTO room_image (room_id, image_url) VALUES 
  (1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'),
  (1, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3'),
  (1, 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3');

-- Verify the images were inserted
SELECT COUNT(*) as total_images FROM room_image WHERE room_id = 1;
SELECT image_url FROM room_image WHERE room_id = 1 LIMIT 3;

EOF

echo "✅ Test images inserted into room 1"
