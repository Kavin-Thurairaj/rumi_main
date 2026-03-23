package com.rumi.rumi_backend_v2.dto;

import com.rumi.rumi_backend_v2.enums.BillingCycle;
import com.rumi.rumi_backend_v2.enums.GenderAllowed;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import com.rumi.rumi_backend_v2.enums.RoomType;

@Getter
@AllArgsConstructor
public class RoomFilterResponse {
    private Long roomId;
    private String roomTitle;
    private String roomDescription;
    private GenderAllowed genderAllowed;
    private RoomStatus roomStatus;
    private int maxRoommates;
    private String city;
    private String country;
    private String addressLine;
    private int amount;
    private BillingCycle billingCycle;
    private RoomType roomType;
}
