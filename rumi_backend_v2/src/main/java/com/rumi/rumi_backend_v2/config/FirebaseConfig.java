package com.rumi.rumi_backend_v2.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Value("${auth.firebase.enabled:true}")
    private boolean firebaseEnabled;

    @Value("${firebase.service-account:}")
    private String serviceAccountPath;

    @PostConstruct
    public void init() throws IOException {
        if (!firebaseEnabled) {
            return;
        }
        if (!FirebaseApp.getApps().isEmpty()) {
            return;
        }

        FirebaseOptions.Builder builder = FirebaseOptions.builder();
        if (serviceAccountPath != null && !serviceAccountPath.isBlank()) {
            try (FileInputStream in = new FileInputStream(serviceAccountPath)) {
                builder.setCredentials(GoogleCredentials.fromStream(in));
            }
        } else {
            builder.setCredentials(GoogleCredentials.getApplicationDefault());
        }

        FirebaseApp.initializeApp(builder.build());
    }
}
