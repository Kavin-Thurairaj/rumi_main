package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.dto.RoomImageDto;
import com.rumi.rumi_backend_v2.repo.RoomRepo;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// here we create a room service interface with uploadRoomImage method
public interface RoomImageService {

    //here we create a method where room id and images as list will created
    void uploadRoomImages(Long room_id, List<MultipartFile> images);

    List<RoomImageDto> fetchRoomImages(Long roomId);
}
