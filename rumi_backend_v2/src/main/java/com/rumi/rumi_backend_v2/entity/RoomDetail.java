package com.rumi.rumi_backend_v2.entity;

import com.rumi.rumi_backend_v2.enums.GenderAllowed;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="room")
@NoArgsConstructor   // Here a default constructor will be created for the RoomDetail class.
@AllArgsConstructor  // Here a parameterised constructor will be created for the RoomDetail class.
@Builder
public class RoomDetail {

    @Id  // This creates an id for th room
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    // Many rooms belong to one renter (User)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Here it creates a user_id column in the RoomDetail table
    private User renter;

    @Setter
    @Getter
    @Enumerated(EnumType.STRING)
    @Column(name = "gender_allowed", nullable = false)
    private GenderAllowed genderAllowed;

    @Setter
    @Getter
    @Column(name="max_roommates",nullable=false)
    private int max_roommates;

    @Setter
    @Getter
    @Column(name="room_title",nullable=false)
    private String room_title;

    @Setter
    @Getter
    @Column(name="room_title",nullable=false)
    private String room_description;

    @Setter
    @Getter
    @Enumerated(EnumType.STRING)
    @Column(name = "room_status", nullable = false)
    private RoomStatus room_status;


}
