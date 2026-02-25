package com.rumi.rumi_backend_v2.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name="rentee_profile")
public class RenteeProfile {

    @Id
    @Getter
    @Column(name="rentee_user_id", nullable=false)
    private String id;  // Here it is a unique id for the rentee profile the firebaseUID

    // here if we set the user object the firebaseUID will be taken and stored in the id variable by the @MapId
    @Getter
    @Setter
    @OneToOne  // Here we map that one user belong to one profile (RenteeProfile)
    @MapsId // Here it takes the firebaseUID and match it in the RenteeProfile
    @JoinColumn(name = "rentee_user_id")
    private User user;  // Here we store the one user related to that UID so we can get the User object details

    @Getter
    @Setter
    @Column(name="preferred_location", nullable=false)
    private String preferred_location;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    @Column(name="gender", nullable=false)
    private Gender gender;

    @Getter
    @Setter
    @Column(name="date_of_birth", nullable=false)
    private LocalDate date_of_birth;


}
