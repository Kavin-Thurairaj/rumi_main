package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.dto.RoomFilterResponse;
import com.rumi.rumi_backend_v2.enums.BillingCycle;
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
        String genderStr = genderAllowed != null ? genderAllowed.name() : null;
        String statusStr = roomStatus != null ? roomStatus.name() : null;

        Page<Object[]> results = roomFilterRepository.filterRoomsNative(
                city, country, minPrice, maxPrice, genderStr, statusStr, pageable
        );

        return results.map(row -> new RoomFilterResponse(
                ((Number) row[0]).longValue(),
                (String) row[1],
                (String) row[2],
                GenderAllowed.valueOf((String) row[3]),
                RoomStatus.valueOf((String) row[4]),
                ((Number) row[5]).intValue(),
                (String) row[6],
                (String) row[7],
                (String) row[8],
                ((Number) row[9]).intValue(),
                BillingCycle.valueOf((String) row[10]),
                (String) row[11]
        ));
    }

    public long getTotalRoomCount() {
        return roomFilterRepository.count();
    }
}