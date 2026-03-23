package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.dto.RoomFilterResponse;
import com.rumi.rumi_backend_v2.enums.BillingCycle;
import com.rumi.rumi_backend_v2.enums.GenderAllowed;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import com.rumi.rumi_backend_v2.enums.RoomType;
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
            RoomType roomType,
            Pageable pageable
    ) {
        String genderStr   = genderAllowed != null ? genderAllowed.name() : null;
        String statusStr   = roomStatus    != null ? roomStatus.name()    : null;
        String roomTypeStr = roomType      != null ? roomType.name()      : null;

        Page<Object[]> results = roomFilterRepository.filterRoomsNative(
                city, country, minPrice, maxPrice, genderStr, statusStr, roomTypeStr, pageable
        );

        return results.map(row -> new RoomFilterResponse(
                ((Number) row[0]).longValue(),
                (String) row[1],
                (String) row[2],
                row[3] != null ? GenderAllowed.valueOf((String) row[3]) : null,
                row[4] != null ? RoomStatus.valueOf((String) row[4])    : null,
                row[5] != null ? ((Number) row[5]).intValue()           : 0,
                (String) row[6],
                (String) row[7],
                (String) row[8],
                row[9]  != null ? ((Number) row[9]).intValue()          : 0,
                row[10] != null ? BillingCycle.valueOf((String) row[10]): null,
                row[11] != null ? RoomType.valueOf((String) row[11])    : null
        ));
    }

    public long getTotalRoomCount() {
        return roomFilterRepository.count();
    }
}