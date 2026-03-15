package com.rumi.rumi_backend_v2.entity;


import com.rumi.rumi_backend_v2.enums.Gender;
import com.rumi.rumi_backend_v2.enums.RoomBookingRequestStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table (name="room_booking_request")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomBookingRequest {

    @Id
    @Getter
    @Column(name="booking_id", nullable = false)
    private String bookingId;

    @ManyToOne  // Here this entity is a child entity of the room so it is ManytoOne relationship
    @Getter
    @JoinColumn(name="room_id", nullable=false)
    private RoomDetail roomId;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    @Column(name="booking_status", nullable=false)
    private RoomBookingRequestStatus bookingStatus;

    @Getter
    @Setter
    @CreationTimestamp  // This will create the data and time automatically when a user account is created
    @Column(name="start_date", nullable = false, updatable = false)
    private LocalDateTime requestStart;

    @Getter
    @Setter
    @Column(name="end_date", updatable = false)
    private LocalDateTime requestEnd;


}
