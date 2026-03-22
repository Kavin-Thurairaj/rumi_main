package com.rumi.rumi_backend_v2.dto;

import com.rumi.rumi_backend_v2.enums.GenderAllowed;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import com.rumi.rumi_backend_v2.enums.RoomType;
import com.rumi.rumi_backend_v2.enums.BillingCycle;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomCreateRequest {
    @NotBlank
    private String roomTitle;
    @NotBlank
    private String roomDescription;
    @NotNull
    private GenderAllowed genderAllowed;
    @Min(1)
    private int maxRoommates;
    @Builder.Default
    private RoomStatus roomStatus = RoomStatus.AVAILABLE;
    @NotNull
    private RoomType roomType;
    @Valid
    @NotNull
    private AddressDto address;
    @Valid
    @NotNull
    private PriceDto price;
    private List<Long> amenityIds;
    private List<Long> ruleIds;
    private List<Long> paymentConditionIds;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressDto {
        @NotNull
        private Integer houseNumber;
        @NotBlank
        private String addressLine;
        @NotBlank
        private String city;
        @NotBlank
        private String country;
        private String mapUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceDto {
        @NotNull
        private Integer amount;
        @NotNull
        private Integer advance;
        @NotNull
        private BillingCycle billingCycle;
    }
}
