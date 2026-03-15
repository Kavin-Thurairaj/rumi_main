package com.rumi.rumi_backend_v2.service.impl;

import com.rumi.rumi_backend_v2.dto.RoomImageDto;
import com.rumi.rumi_backend_v2.entity.RoomDetail;
import com.rumi.rumi_backend_v2.entity.RoomImage;
import com.rumi.rumi_backend_v2.entity.User;
import com.rumi.rumi_backend_v2.enums.RoleName;
import com.rumi.rumi_backend_v2.repo.RoomImageRepo;
import com.rumi.rumi_backend_v2.repo.RoomRepo;
import com.rumi.rumi_backend_v2.repo.UserRepo;
import com.rumi.rumi_backend_v2.service.RoomImageService;
import com.rumi.rumi_backend_v2.util.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomImageServiceImpl implements RoomImageService {

    private final RoomRepo roomRepo;
    private final RoomImageRepo roomImageRepo;
    private final UserRepo userRepo;
    private final SupabaseStorageService supabaseStorageService;

    //here we override the method from the interface and pass the room id and images
    // Inside the method the logic will be done and the image will be added into the room image repo
    @Override
    public void uploadRoomImages(Long roomId, List<MultipartFile> images, String userId) {


        RoomDetail roomDetail=roomRepo.findByRoomId(roomId);  //Here we store the roomDetail the method is from RoomRepo
        if(roomDetail!=null){
            // 2️⃣ Check role
            User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            System.out.println("Service imple user: "+ user);
            System.out.println("Service imple role t/f : " + user.getRole().equals(RoleName.RENTER));
            if(user.getRole() != RoleName.RENTER){
                throw new RuntimeException("Only renters can upload images");
            }

            if(!roomDetail.getRenter().getSupabaseUid().equals(userId)){
                throw new RuntimeException("You do not own this room");
            }

            // here for each MultipartFile in the images are looped and taken
            for(MultipartFile file : images) {

                String extension = getExtensionOfImage(file);  //here the file extension will be returned

                String fileName = UUID.randomUUID() + extension;  //here a random UUID is generated plus _ and file name
                System.out.println("Service: filename: " + fileName);
                String path = roomId + "/" + fileName;  //here a path will be created with room id and filename.
                System.out.println("Service: path:" + path);

                try{
                    String imageUrl= supabaseStorageService.upload(file,path);

                    // Save image record to DB
                    RoomImage roomImage = RoomImage.builder()  // Here we build RoomImage Entity with the Room detail and image Url
                            .room(roomDetail)
                            .imageUrl(imageUrl)  //Here pass the image Url
                            .build();
                    roomImageRepo.save(roomImage);   //here we save the roomImage info in the RoomImage Entity
                }
                catch (RuntimeException e){
                    // Fail fast if any upload fails
                    throw new RuntimeException("Service: Failed to upload image: " + file.getOriginalFilename(), e);
                }
            }

        }
        else {
            // Throw a specific exception with a clear message
            throw new RuntimeException("Room not found with id: " + roomId); // will map to 404 in controller
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
    public List<RoomImageDto> fetchRoomImages(Long roomId) {
        //When fetching give me the room id.
        //Return the images from the RoomImage table.
        //Build in RoomImageDto and return as list
        //If not there, or fetch failed according to the result show in UI like no images, or fetch failed.

        if(roomRepo.existsById(roomId)){
                //select * from roomImage where room_id==roomId
                List<RoomImage> roomImages=roomImageRepo.findByRoom_RoomId(roomId);
                List<RoomImageDto> roomImageDtos = new ArrayList<>();
                for(RoomImage roomImage:roomImages){
                    System.out.println("Service: "+roomImage.getImageUrl());
                    RoomImageDto roomImageDto=RoomImageDto.builder()
                            .imageId(roomImage.getImageId())
                            .imageUrl(roomImage.getImageUrl())
                            .build();
                    roomImageDtos.add(roomImageDto);
                    //System.out.println("Service: "+roomImageDtos);
                    //System.out.println("Service: "+roomImageDtos.size());
                }

                return roomImageDtos;
        }
        else{
            throw new RuntimeException("Room not found with id: " + roomId); // will map to 404 in controller
        }
    }


    //This method is to get the extension from the image.
    private String getExtensionOfImage(MultipartFile file) {
        String contentType = file.getContentType();

        if (contentType == null) {
            throw new RuntimeException("File type cannot be determined");
        }

        return switch (contentType) {
            case "image/jpeg", "image/jpg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            case "image/bmp" -> ".bmp";
            default -> throw new RuntimeException("Invalid image type: " + contentType);
        };
    }

}
