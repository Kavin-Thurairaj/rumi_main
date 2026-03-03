package com.rumi.rumi_backend_v2.entity;


import com.rumi.rumi_backend_v2.enums.RoommateStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="roommate")
@Builder
public class Roommate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Column(name="roommate_id")
    private Long roommateId;

    @ManyToOne
    @JoinColumn(name="room_id", nullable=false)
    @Getter
    @Setter
    private RoomDetail room;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    @Getter
    private User renteeId;  //Here we get the user

    @Getter
    @CreationTimestamp  // This will create the data and time automatically when a user account is created
    @Column(name="joined_date", nullable = false, updatable = false)
    private LocalDateTime joinedDate;

    @Getter
    @Setter
    @Column(name="left_date")
    private LocalDateTime leftDate;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable=false)
    private RoommateStatus roommateStatus;

}
