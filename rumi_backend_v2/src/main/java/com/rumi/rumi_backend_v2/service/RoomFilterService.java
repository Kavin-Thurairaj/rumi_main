package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.dto.RoomFilterResponse;
import com.rumi.rumi_backend_v2.enums.GenderAllowed;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import com.rumi.rumi_backend_v2.repository.RoomFilterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class RoomFilterService {

    @Autowired
    private RoomFilterRepository roomFilterRepository;

    public Page<RoomFilterResponse> filterRooms(
            String city,
            String country,
            Integer minPrice,
            Integer maxPrice,
            GenderAllowed genderAllowed,
            RoomStatus roomStatus,
            Pageable pageable
    ) {
        return roomFilterRepository.filterRooms(
                city, country, minPrice, maxPrice, genderAllowed, roomStatus, pageable
        );
    }
}
