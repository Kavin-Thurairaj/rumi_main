package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.dto.RoomCreateRequest;
import com.rumi.rumi_backend_v2.dto.RoomDetailResponse;
import com.rumi.rumi_backend_v2.dto.RoomUpdateRequest;
import java.util.List;

public interface RoomService {
    Long createRoom(RoomCreateRequest dto, String authHeader);
    RoomDetailResponse getRoom(Long roomId);
    List<RoomDetailResponse> getMyRooms(String authHeader);
    void deleteRoom(Long roomId, String authHeader);
}
