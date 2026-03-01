package com.rumi.rumi_backend_v2.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="room_image")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // here the id will be automatically created and incremented
    @Getter
    @Column(name = "image_id")
    private Long imageId;

    @ManyToOne
    @JoinColumn(name="room_id", nullable=false)
    private RoomDetail room;

    @Getter
    @Setter
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

}
