package com.rumi.rumi_backend_v2.controller;


import com.rumi.rumi_backend_v2.dto.RoomImageDto;
import com.rumi.rumi_backend_v2.repo.RoomRepo;
import com.rumi.rumi_backend_v2.service.RoomImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController  //here we register the class as api endpoint
@RequestMapping(path = "/api/rooms")  //the parent endpoint is /api/rooms
@RequiredArgsConstructor
public class RoomImageController {

    private final RoomImageService roomImageService;


    @PostMapping(path = "/{room_id}/images")  //here the psot mapping url is room id/ image
    //here we take the room_id as Path Param and store it in the room_id variable
    public ResponseEntity<?> uploadImages(@PathVariable("room_id") long room_id, @RequestParam("image")List<MultipartFile> images){
        try{
            roomImageService.uploadRoomImages(room_id,images);
            return new ResponseEntity<>("Room Image Added", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Image Upload Failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // This is a GET request
    @GetMapping(path = "/{room_id}/images")  //Here this is the Get url
    public ResponseEntity<?> fetchImages(@PathVariable("room_id") long room_id){
        try{
            List<RoomImageDto> roomImageDtos = roomImageService.fetchRoomImages(room_id);
            return new ResponseEntity<>(roomImageDtos, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Image Fetch Failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
