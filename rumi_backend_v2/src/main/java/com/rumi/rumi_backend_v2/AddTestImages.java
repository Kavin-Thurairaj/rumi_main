import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class AddTestImages {
    public static void main(String[] args) throws Exception {
        // PostgreSQL connection details
        String url = "jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";
        String user = "postgres.uuicntunejvvwzfcypey";
        String password = "Y3T9VnHSMZIoQ29j";
        
        Class.forName("org.postgresql.Driver");
        
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            String sql = "INSERT INTO room_image (room_id, image_url) VALUES (?, ?)";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            
            String[] imageUrls = {
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=800&auto=format&fit=crop"
            };
            
            for (String url2 : imageUrls) {
                pstmt.setLong(1, 1L);
                pstmt.setString(2, url2);
                pstmt.addBatch();
            }
            
            int[] result = pstmt.executeBatch();
            System.out.println("✓ Added " + result.length + " test images to room 1");
            conn.close();
        }
    }
}
