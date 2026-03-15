package com.rumi.rumi_backend_v2.repository;

import com.rumi.rumi_backend_v2.dto.RoomFilterResponse;
import com.rumi.rumi_backend_v2.entity.RoomDetail;
import com.rumi.rumi_backend_v2.enums.GenderAllowed;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomFilterRepository extends JpaRepository<RoomDetail, Long> {

    @Query("""
    SELECT new com.rumi.rumi_backend_v2.dto.RoomFilterResponse(
        r.roomId,
        r.roomTitle,
        r.roomDescription,
        r.genderAllowed,
        r.roomStatus,
        r.maxRoommates,
        a.city,
        a.country,
        a.addressLine,
        p.amount,
        p.billingCycle
    )
    FROM RoomDetail r
    JOIN Address a ON a.room = r
    JOIN RoomPrice p ON p.room = r
    WHERE (:city IS NULL OR a.city = :city)
    AND (:country IS NULL OR a.country = :country)
    AND (:minPrice IS NULL OR p.amount >= :minPrice)
    AND (:maxPrice IS NULL OR p.amount <= :maxPrice)
    AND (:genderAllowed IS NULL OR r.genderAllowed = :genderAllowed)
    AND (:roomStatus IS NULL OR r.roomStatus = :roomStatus)
""")

    Page<RoomFilterResponse> filterRooms(
            @Param("city") String city,
            @Param("country") String country,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("genderAllowed") GenderAllowed genderAllowed,
            @Param("roomStatus") RoomStatus roomStatus,
            Pageable pageable
    );
}
