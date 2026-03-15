package com.rumi.rumi_backend_v2.repo;

import com.rumi.rumi_backend_v2.entity.RoomDetail;
import com.rumi.rumi_backend_v2.entity.RoomImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepo extends JpaRepository<RoomDetail, Long> {
    RoomDetail findByRoomId(Long roomId);
}
