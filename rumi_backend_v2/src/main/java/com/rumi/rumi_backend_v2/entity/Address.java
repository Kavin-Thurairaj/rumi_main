package com.rumi.rumi_backend_v2.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="address")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address {

    @OneToOne
    @Getter
    @JoinColumn(name="room_id", nullable=false)
    private RoomDetail room_id;

    @Getter
    @Setter
    @Column(name="house_number", nullable=false)
    private int houseNumber;

    @Getter
    @Setter
    @Column(name="address_line", nullable=false)
    private String addressLine;

    @Getter
    @Setter
    @Column(name="city", nullable=false)
    private String city;

    @Getter
    @Setter
    @Column(name="country", nullable=false)
    private String country;

    @Getter
    @Setter
    @Column(name="map_url", nullable=false)
    private String mapUrl;



}
