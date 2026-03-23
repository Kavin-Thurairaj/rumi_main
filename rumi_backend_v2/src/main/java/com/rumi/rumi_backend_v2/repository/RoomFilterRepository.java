package com.rumi.rumi_backend_v2.repository;

import com.rumi.rumi_backend_v2.entity.RoomDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomFilterRepository extends JpaRepository<RoomDetail, Long> {

    @Query(value = """
        SELECT rd.room_id, rd.room_title, rd.room_description, rd.gender_allowed,
               rd.room_status, rd.max_roommates, a.city, a.country, a.address_line,
               rp.amount, rp.billing_cycle,
               (SELECT ri.image_url FROM room_image ri WHERE ri.room_id = rd.room_id LIMIT 1) as image_url,
               rd.room_type
        FROM room_detail rd
        JOIN address a ON a.room_id = rd.room_id
        JOIN room_price rp ON rp.room_id = rd.room_id
        WHERE (:city IS NULL OR LOWER(a.city) = LOWER(:city))
        AND (:country IS NULL OR LOWER(a.country) = LOWER(:country))
        AND (:minPrice IS NULL OR rp.amount >= :minPrice)
        AND (:maxPrice IS NULL OR rp.amount <= :maxPrice)
        AND (:genderAllowed IS NULL OR rd.gender_allowed::text = :genderAllowed)
        AND (:roomStatus IS NULL OR rd.room_status::text = :roomStatus)
        AND (:roomType IS NULL OR rd.room_type::TEXT = :roomType)
    """,
        countQuery = """
        SELECT COUNT(*)
        FROM room_detail rd
        JOIN address a ON a.room_id = rd.room_id
        JOIN room_price rp ON rp.room_id = rd.room_id
        WHERE (:city IS NULL OR LOWER(a.city) = LOWER(:city))
        AND (:country IS NULL OR LOWER(a.country) = LOWER(:country))
        AND (:minPrice IS NULL OR rp.amount >= :minPrice)
        AND (:maxPrice IS NULL OR rp.amount <= :maxPrice)
        AND (:genderAllowed IS NULL OR rd.gender_allowed::TEXT = :genderAllowed)
        AND (:roomStatus IS NULL OR rd.room_status::TEXT = :roomStatus)
        AND (:roomType IS NULL OR rd.room_type::TEXT = :roomType)
    """,
        nativeQuery = true)
    Page<Object[]> filterRoomsNative(
            @Param("city") String city,
            @Param("country") String country,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("genderAllowed") String genderAllowed,
            @Param("roomStatus") String roomStatus,
            @Param("roomType") String roomType,
            Pageable pageable
    );
}