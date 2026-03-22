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
    public ResponseEntity<?> uploadImages(@PathVariable("room_id") long roomId, @RequestParam("image")List<MultipartFile> images,@RequestHeader(value = "Authorization",required = false) String authHeader){
        try{
            System.out.println("controller access token:"+authHeader);
            String userId = supabaseAuthService.getUserId(authHeader); // verify + extract userId

            roomImageService.uploadRoomImages(roomId,images,userId);
            System.out.println("Controller room id: "+roomId);
            System.out.println("Data passed from controller to service.");
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Room Image Added"));
        }

        catch (ResponseStatusException e) {
            // Handle 401
            System.out.println("Controller: " + e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("error","Missing or invalid Authorization header"));
        }

        catch(RuntimeException e){
            if (e.getMessage().contains("Room not found")) {
                System.out.println("Controller: "+e.getMessage());
                //System.out.println(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Room not found")));
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
            }

            if (e.getMessage().contains("Only renters") || e.getMessage().contains("do not own")) {
                System.out.println("Only renter can upload images.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
            }

            if(e.getMessage().contains("Authorised, Invalid") || e.getMessage().contains("expired token")){
                System.out.println("Controller: Token validation failed - " + e.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired authentication token. Please log in again."));
            }

            //TODO: have to show user image type error
            System.out.println("Controller: "+e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Image Upload Failed: " + e.getMessage()));
        }

        catch (Exception e) {
            System.out.println("Controller: Unexpected error - " + e.getMessage());
            System.out.println("Exception type: " + e.getClass().getSimpleName());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Image Upload Failed: " + e.getClass().getSimpleName() + " - " + e.getMessage()));
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
