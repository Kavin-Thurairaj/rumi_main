package com.rumi.rumi_backend_v2.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="renter_profile")
public class RenterProfile {
    @Id
    @Getter
    @Column(name="renter_user_id", nullable=false)
    private String id;  // Here it is a unique id for the rentee profile the firebaseUID

    @Getter
    @Setter
    @OneToOne  // Here we map that one user belong to one profile (RenteeProfile)
    @MapsId // Here it takes the firebaseUID and match it in the RenteeProfile
    @JoinColumn(name = "renter_user_id")
    private User user;  // Here we store the one user related to that UID so we can get the User object details

    @Getter
    @Setter
    @Column(name="location", nullable=false)
    private String location;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    @Column(name="gender", nullable=false)
    private Gender gender;

}
