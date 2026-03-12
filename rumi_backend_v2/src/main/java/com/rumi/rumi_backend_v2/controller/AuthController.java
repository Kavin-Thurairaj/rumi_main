package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.entity.User;
import com.rumi.rumi_backend_v2.enums.RoleName;
import com.rumi.rumi_backend_v2.enums.UserStatus;
import com.rumi.rumi_backend_v2.service.UserService;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${auth.supabase.enabled:true}")
    private boolean supabaseEnabled;

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        try {
            String uid;
            String email;
            if (supabaseEnabled) {
                if (request.accessToken == null || request.accessToken.isBlank()) {
                    throw new IllegalArgumentException("accessToken is required");
                }
                // TODO: verify Supabase JWT and extract uid/email
            }
            if (request.supabaseUid == null || request.supabaseUid.isBlank()) {
                throw new IllegalArgumentException("supabaseUid is required");
            }
            if (request.email == null || request.email.isBlank()) {
                throw new IllegalArgumentException("email is required");
            }
            uid = request.supabaseUid;
            email = request.email;
            User user = User.builder()
                .supabaseUid(uid)
                .full_name(request.name)
                .email(email)
                .phone_number(request.phoneNumber)
                .role(request.role)
                .status(UserStatus.ACTIVE)
                .profile_complete(false)
                .phone_verified(false)
                .build();
            User saved = userService.register(user);
            return RegisterResponse.success(saved);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        try {
            User user;
            if (supabaseEnabled) {
                if (request.accessToken == null || request.accessToken.isBlank()) {
                    throw new IllegalArgumentException("accessToken is required");
                }
                // TODO: verify Supabase JWT and extract uid
            }
            if (request.supabaseUid != null && !request.supabaseUid.isBlank()) {
                user = userService.findBySupabaseUid(request.supabaseUid);
            } else if (request.email != null && !request.email.isBlank()) {
                user = userService.findByEmail(request.email);
            } else {
                throw new IllegalArgumentException("supabaseUid or email is required");
            }
            return UserResponse.from(user);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, ex.getMessage());
        }
    }

    public static class RegisterRequest {
        @JsonAlias("access_token")
        public String accessToken;
        @JsonAlias("supabase_uid")
        public String supabaseUid;
        public String email;
        @JsonAlias({"full_name", "fullName", "name"})
        public String name;
        @JsonAlias({"phone_number", "phone"})
        public String phoneNumber;
        public RoleName role;
    }

    public static class LoginRequest {
        @JsonAlias("access_token")
        public String accessToken;
        @JsonAlias("supabase_uid")
        public String supabaseUid;
        public String email;
    }

    public static class UserResponse {
        public String id;
        public String name;
        public String email;
        public RoleName role;

        static UserResponse from(User user) {
            UserResponse response = new UserResponse();
            response.id = user.getSupabaseUid();
            response.name = user.getFull_name();
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
