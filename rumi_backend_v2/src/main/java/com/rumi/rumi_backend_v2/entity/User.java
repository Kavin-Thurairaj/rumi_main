package com.rumi.rumi_backend_v2.entity;

import com.rumi.rumi_backend_v2.enums.RoleName;
import com.rumi.rumi_backend_v2.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
@Table(name="app_user")
@Builder           // for easy object creation
@AllArgsConstructor       // needed by @Builder
@NoArgsConstructor  // required by JPA
public class User {

    @Id
    @Getter
    @Column(name="user_id", nullable = false, unique = true)
    private String supabaseUid;

    @Getter
    @Column(name="full_name", nullable = false)
    private String full_name;

    @Getter
    @Column(name="email",nullable = false, unique = true)
    private String email;

    @Getter
    @Column(name="phone_number",nullable = false, unique = true)
    private String phone_number;

    @Getter
    @Setter
    // Role field using enum
    @Enumerated(EnumType.STRING)
    @Column(name ="role",nullable = false)
    // here we store only the enum value (Admin, Renter and Rentee)
    private RoleName role;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)   // The enum value will be stored as String
    @Column(name="status",nullable = false)
    // here we store only the enum value (Active, Inactive, Suspended, Deleted)
    private UserStatus status;

    @Getter
    @Setter
    @Column(name="profile_complete",nullable = false)
    private boolean profile_complete;

    @Getter
    @Setter
    @Column(name="phone_verified",nullable = false)
    private boolean phone_verified;

    @Getter
    @CreationTimestamp  // This will create the data and time automatically when a user account is created
    @Column(name="created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;


}
