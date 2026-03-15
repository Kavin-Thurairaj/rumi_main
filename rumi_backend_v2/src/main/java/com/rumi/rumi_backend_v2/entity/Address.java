package com.rumi.rumi_backend_v2.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="address")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @Column(name="room_id")
    @Getter
    private Long id;   // Here the primary key will be stored where it will be mapped as primary and foreign key

    @OneToOne
    @Getter
    @Setter
    @MapsId  // This will take the primary key of the RoomDetail and map it as a foreign and primary key for the Address Entity
    @JoinColumn(name="room_id", nullable=false)
    private RoomDetail room;

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
