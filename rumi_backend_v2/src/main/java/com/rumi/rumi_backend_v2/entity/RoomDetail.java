package com.rumi.rumi_backend_v2.entity;

// IMPORT OF THE GENDERALLOWED ENUM
import com.rumi.rumi_backend_v2.enums.GenderAllowed;

// IMPORT OF THE ROOMSTATUS ENUM
import com.rumi.rumi_backend_v2.enums.RoomStatus;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="room_detail")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDetail {

    @Id  // This creates an id for th room
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long roomId;

    // Many rooms belong to one renter (User)
    @Getter
    @ManyToOne (fetch = FetchType.LAZY)  // fetch = FetchType.LAZY is to load only the room details not whole renter details until asked
    @JoinColumn(name = "user_id", nullable = false) // Here it creates a user_id column in the RoomDetail table
    private User renter;

    @Setter
    @Getter
    @Enumerated(EnumType.STRING)
    @Column(name = "gender_allowed",columnDefinition = "gender_allowed",nullable = false)
    private GenderAllowed genderAllowed;

    @Setter
    @Getter
    @Column(name="max_roommates",nullable=false)
    private int maxRoommates;

    @Setter
    @Getter
    @Column(name="room_title",nullable=false)
    private String roomTitle;

    @Setter
    @Getter
    @Column(name="room_description",nullable=false)
    private String roomDescription;

    @ManyToMany  //here it is resolving the many to many relationship
    @Getter
    @JoinTable(name="room_amenity",
        joinColumns=@JoinColumn(name="room_id"),  // here it will take the primary key from the RoomDetail entity
        inverseJoinColumns=@JoinColumn(name="amenity_id")  //here it will take the primary key from the Amenity entity
        )
    private Set<Amenity> amenities = new HashSet<>();  // here the amenities will be stored as set

    @ManyToMany
    @Getter
    @JoinTable(name="room_rule",
            joinColumns=@JoinColumn(name="room_id"),  // here it will take the primary key from the RoomDetail entity
            inverseJoinColumns=@JoinColumn(name="rule_id")  // here it will take the primary key from the Rule entity
    )
    private Set<Rule> rules = new HashSet<>();

    @ManyToMany
    @Getter
    @JoinTable(name="room_payment_condition",
            joinColumns=@JoinColumn(name="room_id"),  // here it will take the primary key from the RoomDetail entity
            inverseJoinColumns=@JoinColumn(name="condition_id")  // here it will take the primary key from the PaymentCondition entity
    )
    private Set<PaymentCondition> paymentConditions = new HashSet<>();

    @Setter
    @Getter
    @Enumerated(EnumType.STRING)
    @Column(name = "room_status",columnDefinition = "room_status",nullable = false)
    private RoomStatus roomStatus;

        public void setRenter(User renter) {
            this.renter = renter;
        }

        public void setAmenities(Set<Amenity> amenities) {
            this.amenities = amenities;
        }

        public void setRules(Set<Rule> rules) {
            this.rules = rules;
        }

        public void setPaymentConditions(Set<PaymentCondition> paymentConditions) {
            this.paymentConditions = paymentConditions;
        }

        public Address getAddress() {
            // Implement according to your mapping, placeholder
            return null;
        }

        public RoomPrice getRoomPrice() {
            // Implement according to your mapping, placeholder
            return null;
        }

}
