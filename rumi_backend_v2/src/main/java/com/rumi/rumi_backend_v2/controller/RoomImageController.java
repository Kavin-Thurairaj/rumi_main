package com.rumi.rumi_backend_v2.controller;


import com.rumi.rumi_backend_v2.dto.RoomImageDto;
import com.rumi.rumi_backend_v2.repo.RoomRepo;
import com.rumi.rumi_backend_v2.service.RoomImageService;
import com.rumi.rumi_backend_v2.util.SupabaseAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController  //here we register the class as api endpoint
@RequestMapping(path = "/api/rooms")  //the parent endpoint is /api/rooms
@RequiredArgsConstructor
public class RoomImageController {

    private final RoomImageService roomImageService;
    private final SupabaseAuthService supabaseAuthService;


    @PostMapping(path = "/{room_id}/images")  //here the psot mapping url is room id/ image
    //here we take the room_id as Path Param and store it in the room_id variable
    public ResponseEntity<?> uploadImages(@PathVariable("room_id") long roomId, @RequestParam("image")List<MultipartFile> images,@RequestHeader("Authorization") String authHeader){
        try{
            // Check header exists
            System.out.println("controller access token:"+authHeader);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header");
            }

            String token = authHeader.replace("Bearer ", ""); // clean token
            String userId = supabaseAuthService.getUserId(token); // verify + extract userId

            roomImageService.uploadRoomImages(roomId,images,userId);
            System.out.println("Controller: "+roomId);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Room Image Added"));
        }
        catch(RuntimeException e){
            if (e.getMessage().contains("Room not found")) {
                System.out.println("Controller: "+e.getMessage());
                System.out.println(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Room not found")));
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Room not found"));
            }
            //TODO: have to show user image type error
            System.out.println("Controller: "+e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Image Upload Failed"));
        }
        catch (Exception e) {
            System.out.println("Controller: "+e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Image Upload Failed"));
        }

    }



    // This is a GET request
    @GetMapping(path = "/{room_id}/images")  //Here this is the Get url
    public ResponseEntity<?> fetchImages(@PathVariable("room_id") long roomId){
        try{
            //List<RoomImageDto> roomImageDtos = roomImageService.fetchRoomImages(room_id);

            //We are trying to fetch room images
            // From room image table we are going to query images.
            // We pass roomId to get the Room images that are related to that room.
            // select * from RoomImage where room_id == roomId
            // return multiple records - RoomImage object
            // List of RoomImage Objects
            // We send back as RoomImageDto
            List<RoomImageDto> roomImageDtos= roomImageService.fetchRoomImages(roomId); //here we call the roomService and its fetch method.
            return new ResponseEntity<>(roomImageDtos, HttpStatus.OK);
        }
        catch(RuntimeException e){
            if (e.getMessage().contains("Room not found")) {
                System.out.println("Controller: "+e.getMessage());
                System.out.println(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Room not found")));
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Room not found"));
            }
            //TODO: have to show user image type error
            System.out.println("Controller: "+e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Image Fetch Failed"));
        }
        catch (Exception e) {
            System.out.println("Controller: "+e.getMessage());
            return new ResponseEntity<>("Image Fetch Failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
