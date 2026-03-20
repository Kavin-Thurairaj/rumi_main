package com.rumi.rumi_backend_v2.entity;

import com.rumi.rumi_backend_v2.enums.PaymentConditionName;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="payment_condition")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="condition_id")
    @Getter
    private Long condition_id;

    @Enumerated(EnumType.STRING)
    @Getter
    @Setter
    // In Supabase we ran a postreqsql query for the enum creation in the db and columndefinition to link it enum and column.
    @Column(name="condition_name",columnDefinition = "payment_condition_name",nullable=false )
    private PaymentConditionName conditionName;


}
