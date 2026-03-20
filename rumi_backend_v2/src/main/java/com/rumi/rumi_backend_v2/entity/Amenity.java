package com.rumi.rumi_backend_v2.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="amenity")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Amenity {

    @Id
    @Getter
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="amenity_id")
    private Long amenityId;

    @Getter
    @Setter
    @Column(name="amenity_name")
    
    public String getName() {
        return amenityName;
    }
    private String amenityName;

}
