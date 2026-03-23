package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.dto.RoomFilterResponse;
import com.rumi.rumi_backend_v2.enums.GenderAllowed;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import com.rumi.rumi_backend_v2.enums.RoomType;
import com.rumi.rumi_backend_v2.service.RoomFilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomFilterController {

    @Autowired
    private RoomFilterService roomFilterService;

    @GetMapping("/search")
    public ResponseEntity<Page<RoomFilterResponse>> searchRooms(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) String genderAllowed,
            @RequestParam(required = false) String roomStatus,
            @RequestParam(required = false) String roomType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        GenderAllowed genderAllowedEnum;
        RoomStatus roomStatusEnum;
        RoomType roomTypeEnum;
        try {
            genderAllowedEnum = parseEnum(GenderAllowed.class, genderAllowed);
            roomStatusEnum = parseEnum(RoomStatus.class, roomStatus);
            roomTypeEnum = parseEnum(RoomType.class, roomType);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }

        String normalizedCity = normalizeText(city);
        String normalizedCountry = normalizeText(country);
        Integer normalizedMinPrice = minPrice;
        Integer normalizedMaxPrice = maxPrice;
        if (normalizedMinPrice != null && normalizedMaxPrice != null
                && normalizedMinPrice > normalizedMaxPrice) {
            Integer swap = normalizedMinPrice;
            normalizedMinPrice = normalizedMaxPrice;
            normalizedMaxPrice = swap;
        }

        int safePage = Math.max(page, 0);
        int safeSize = size <= 0 ? 10 : size;
        Pageable pageable = PageRequest.of(safePage, safeSize);
        Page<RoomFilterResponse> results = roomFilterService.filterRooms(
                normalizedCity,
                normalizedCountry,
                normalizedMinPrice,
                normalizedMaxPrice,
                genderAllowedEnum,
                roomStatusEnum,
                roomTypeEnum,
                pageable
        );
        return ResponseEntity.ok(results);
    }

    private String normalizeText(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        if (trimmed.isEmpty()) return null;
        return trimmed.toLowerCase(Locale.ROOT);
    }

    private <T extends Enum<T>> T parseEnum(Class<T> enumType, String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        if (trimmed.isEmpty()) return null;
        for (T constant : enumType.getEnumConstants()) {
            if (constant.name().equalsIgnoreCase(trimmed)) return constant;
        }
        throw new IllegalArgumentException("Invalid value for " + enumType.getSimpleName());
    }
}