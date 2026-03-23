package com.rumi.rumi_backend_v2.dto;

import com.rumi.rumi_backend_v2.enums.GenderAllowed;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import com.rumi.rumi_backend_v2.enums.RoomType;
import com.rumi.rumi_backend_v2.enums.BillingCycle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDetailResponse {
    private Long roomId;
    private String roomTitle;
    private String roomDescription;
    private GenderAllowed genderAllowed;
    private int maxRoommates;
    private RoomStatus roomStatus;
    private RoomType roomType;
    private AddressDto address;
    private PriceDto price;
    private List<AmenityDto> amenities;
    private List<RuleDto> rules;
    private List<PaymentConditionDto> paymentConditions;
    private String renterId;
    private List<String> imageUrls;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressDto {
        private Integer houseNumber;
        private String addressLine;
        private String city;
        private String country;
        private String mapUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceDto {
        private Integer amount;
        private Integer advance;
        private BillingCycle billingCycle;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AmenityDto {
        private Long amenityId;
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RuleDto {
        private Long ruleId;
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentConditionDto {
        private Long conditionId;
        private String name;
    }
}
