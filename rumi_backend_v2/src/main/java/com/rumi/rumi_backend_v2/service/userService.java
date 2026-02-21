package com.rumi.rumi_backend_v2.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.rumi.rumi_backend_v2.entity.User;
import com.rumi.rumi_backend_v2.repo.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        // TODO: hash password before saving.
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        return user;
    }
}
