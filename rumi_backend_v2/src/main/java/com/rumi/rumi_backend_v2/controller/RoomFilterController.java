package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.dto.RoomFilterResponse;
import com.rumi.rumi_backend_v2.enums.GenderAllowed;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import com.rumi.rumi_backend_v2.service.RoomFilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @RequestParam(required = false) GenderAllowed genderAllowed,
            @RequestParam(required = false) RoomStatus roomStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RoomFilterResponse> results = roomFilterService.filterRooms(
                city, country, minPrice, maxPrice, genderAllowed, roomStatus, pageable
        );
        return ResponseEntity.ok(results);
    }
}