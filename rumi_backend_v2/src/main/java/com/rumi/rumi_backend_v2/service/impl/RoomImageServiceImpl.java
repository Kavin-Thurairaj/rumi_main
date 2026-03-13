package com.rumi.rumi_backend_v2.service.impl;

import com.rumi.rumi_backend_v2.dto.RoomImageDto;
import com.rumi.rumi_backend_v2.entity.RoomDetail;
import com.rumi.rumi_backend_v2.repo.RoomImageRepo;
import com.rumi.rumi_backend_v2.repo.RoomRepo;
import com.rumi.rumi_backend_v2.service.RoomImageService;
import com.rumi.rumi_backend_v2.util.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomImageServiceImpl implements RoomImageService {

    private final RoomRepo roomRepo;
    private final RoomImageRepo roomImageRepo;
    private final SupabaseStorageService supabaseStorageService;

    //here we override the method from the interface and pass the room id and images
    // Inside the method the logic will be done and the image will be added into the room image repo
    @Override
    public void uploadRoomImages(Long roomId, List<MultipartFile> images) {

        if(roomRepo.existsById(roomId)){
            RoomDetail roomDetail=roomRepo.findByRoomId(roomId);  //Here we store the roomDetail the method is from RoomRepo

            // here for each MultipartFile in the images are looped and taken
            for(MultipartFile file : images) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();  //here a random UUID is generated plus _ and file name
                System.out.println("filename: " + fileName);
                String path = roomId + "/" + fileName;  //here a path will be created with room id and filename.
                System.out.println("path:" + path);

                String imageUrl= supabaseStorageService.upload(file,path);
            }


        }
        else {
            // Throw a specific exception with a clear message
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Room not found with id: " + roomId
            );
        }
        //Front-end should first collect room details to upload room (All room information including images single UI)
        //Room creation API --> After created we get room_id
        //If room creation was a success --> we get room id
        //Then we call the room image upload with the room id
        //If success account creation success with images.
        //Else fail Images upload was not a success but room creation was a success.



        //According to our system
        //Room creation separate API, Room Image Upload separate API



        //Should check whether the room id exists
        //Then we should check whether authenticated user
        //Check whether user role is renter, or do not allow
        //Upload image to Supabase
        //Add the links to Room Image table.






    }

    @Override
    public List<RoomImageDto> fetchRoomImages(Long room_id) {
        //When fetching give me the room id.
        //Return the images from the RoomImage table.
        //If not there, or fetch failed according to the result show in UI like no images, or fetch failed.

    }


}
