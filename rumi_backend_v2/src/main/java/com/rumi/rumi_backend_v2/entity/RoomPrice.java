package com.rumi.rumi_backend_v2.entity;

import com.rumi.rumi_backend_v2.enums.BillingCycle;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="room_price")
public class RoomPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="price_id")
    @Getter
    private Long priceId;

    @OneToOne
    @JoinColumn(name="room_id",nullable=false)
    @Getter
    private RoomDetail room;

    @Column(name="billing_cycle",columnDefinition = "billing_cycle",nullable=false)
    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    private BillingCycle billingCycle;

    @Column(name="amount")
    @Getter
    @Setter
    private int amount;

    @Column(name="advance")
    @Getter
    @Setter
    private int advance;

}
