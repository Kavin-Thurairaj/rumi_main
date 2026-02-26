package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.entity.Role;
import com.rumi.rumi_backend_v2.entity.User;
import com.rumi.rumi_backend_v2.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        try {
            User user = new User(
                null,
                request.name,
                request.email,
                request.password,
                request.role
            );
            User saved = userService.register(user);
            return RegisterResponse.success(saved);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.email, request.password);
            return UserResponse.from(user);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, ex.getMessage());
        }
    }

    public static class RegisterRequest {
        public String name;
        public String email;
        public String password;
        public Role role;
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class UserResponse {
        public Long id;
        public String name;
        public String email;
        public Role role;

        static UserResponse from(User user) {
            UserResponse response = new UserResponse();
            response.id = user.getId();
            response.name = user.getName();
            response.email = user.getEmail();
            response.role = user.getRole();
            return response;
        }
    }

    public static class RegisterResponse {
        public String message;
        public UserResponse user;

        static RegisterResponse success(User user) {
            RegisterResponse response = new RegisterResponse();
            response.message = "successful register";
            response.user = UserResponse.from(user);
            return response;
        }
    }
}
