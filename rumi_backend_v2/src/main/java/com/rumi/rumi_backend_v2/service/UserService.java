package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.entity.User;
import com.rumi.rumi_backend_v2.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        return userRepository.save(user);
    }

    public User findBySupabaseUid(String uid) {
        return userRepository.findById(uid)
            .orElseThrow(() -> new IllegalArgumentException("User not registered"));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not registered"));
    }
}
