package com.rumi.rumi_backend_v2.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

@Service
public class SupabaseStorageService {

    @Value("${SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${SUPABASE_SERVICE_KEY}")
    private String serviceKey;

    @Value("${SUPABASE_BUCKET}")
    private String bucket;


    public String upload(MultipartFile file, String path) {
        try {
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + path;
            HttpURLConnection connection = getHttpURLConnection(file, uploadUrl);

            try (OutputStream os = connection.getOutputStream()) {
                os.write(file.getBytes());
            }

            int responseCode = connection.getResponseCode();
            if (responseCode != 200) {
                System.out.println("SupaBase: "+ connection.getResponseMessage() +" "+ connection.toString() );
                throw new RuntimeException("Supabase Image Upload Failed: " + connection.getResponseMessage());
            }

            // Return public URL (corrected with slash)
            return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + path;

        }
        catch (IOException e) {
            throw new RuntimeException("Supabase Image Upload Failed: " + e.getMessage(), e);
        }

    }

    private HttpURLConnection getHttpURLConnection(MultipartFile file, String uploadUrl) throws IOException {
        HttpURLConnection connection = (HttpURLConnection) new URL(uploadUrl).openConnection();  // This opens the connection for the supabase
        connection.setRequestMethod("POST");  // here we say the connection as POST
        connection.setDoOutput(true);  // This allows the data to be sent in the body
        connection.setRequestProperty("Authorization", "Bearer " + serviceKey); //Here we pass the service key to Supabase connection so it can verify
        connection.setRequestProperty("Content-Type", file.getContentType());  // Here we say what file type it is .
        return connection;
    }

}
