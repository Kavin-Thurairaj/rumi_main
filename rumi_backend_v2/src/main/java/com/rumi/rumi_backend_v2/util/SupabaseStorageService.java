package com.rumi.rumi_backend_v2.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

public class SupabaseStorageService {

    @Value("${SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${SUPABASE_SERVICE_KEY}")
    private String serviceKey;

    @Value("${SUPABASE_BUCKET}")
    private String bucket;


    public String upload(MultipartFile file, String path) {

        String uploadUrl=supabaseUrl + "/storage/v1/object/" + bucket+ "/" + path;



    }
}
