package com.rumi.rumi_backend_v2.service;

import com.rumi.rumi_backend_v2.entity.RoomDetail;
import com.rumi.rumi_backend_v2.entity.RoomImage;
import com.rumi.rumi_backend_v2.entity.User;
import com.rumi.rumi_backend_v2.enums.RoleName;
import com.rumi.rumi_backend_v2.repo.RoomImageRepo;
import com.rumi.rumi_backend_v2.repo.RoomRepo;
import com.rumi.rumi_backend_v2.repo.UserRepo;
import com.rumi.rumi_backend_v2.service.impl.RoomImageServiceImpl;
import com.rumi.rumi_backend_v2.util.SupabaseStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;
import java.util.Optional;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)  // Here we extend the class with Mockito Extension.
public class RoomImageServiceTest {

    @Mock  // Here a mock annotation is used so that the real object will not be added a mock object for testing.
    private RoomRepo roomRepo;

    @Mock
    private UserRepo userRepo;

    @Mock
    private RoomImageRepo roomImageRepo;

    @Mock
    private SupabaseStorageService supabaseStorageService;


    @InjectMocks  // This injects the needed methods for the RoomImageServiceImple from repos.
    private RoomImageServiceImpl roomImageServiceImpl;

    private RoomDetail room;
    private User userRenter;
    private User userRenter02;

    @BeforeEach
    void setUp() {
        userRenter= User.builder().supabaseUid("user123").role(RoleName.RENTER).build(); //Used builder to construct the User object as renter
        room = RoomDetail.builder().roomId(1L).renter(userRenter).build(); // Used builder to construct the room and connect the renter to the room.
        userRenter02= User.builder().supabaseUid("user456").role(RoleName.RENTER).build();
    }


    @Test  //This a test annotation for this upload room image method
    //Here we check the Success Scenario of Room Image Uploading
    void testUploadRoomImageSuccessfully(){
        // Mock multipart file
        //here we are create our mock or fake data to test the logic of uploading
        MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "fake-image".getBytes());
        when(roomRepo.findByRoomId(1L)).thenReturn(room);  // here I say that if the room id is passed then return the room
        when(userRepo.findById("user123")).thenReturn(Optional.ofNullable(userRenter));
        when(supabaseStorageService.upload(any(), any())).thenReturn("http://fake-url.com/image.jpg");


        // THIS THE PLACE WHERE WE SEND THE MOCK DATA TRY TO ACHIEVE THE EXPECTED AND ACTUAL OUTCOME.
        //Here we send the mock or fake data to room service imple method.
        roomImageServiceImpl.uploadRoomImages(1L, List.of(file),"user123");

        //Here we create a captor object only to captor the RoomImage objects that are saved in the roomImageRepo
        ArgumentCaptor<RoomImage> captor = ArgumentCaptor.forClass(RoomImage.class);

        verify(roomImageRepo).save(captor.capture());

        //here we get the Room Image object
        RoomImage savedRoomImage =captor.getValue();

        assertEquals("http://fake-url.com/image.jpg",savedRoomImage.getImageUrl());
        assertEquals(room,savedRoomImage.getRoom());

        System.out.println("Success Scenario Tested Successfully");
    }

    @Test
    void testUploadRoomImageRoomNotFound(){

        MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "fake-image".getBytes());
        when(roomRepo.findByRoomId(7L)).thenReturn(null); // here the id 7L return null.


        // Now we pass it to the uploadRoomImage method where it will throw a Runtime Exception
        try{
            roomImageServiceImpl.uploadRoomImages(7L, List.of(file),"user123");
        }
        catch (RuntimeException e){
            assertEquals("Room not found with id: 7",e.getMessage());

        }
    }

    @Test
    void testUploadRoomImageUserNotFound(){
        MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "fake-image".getBytes());

        when(roomRepo.findByRoomId(1L)).thenReturn(room); // here the id 7L return null.
        when(userRepo.findById("user456")).thenReturn(Optional.ofNullable(userRenter02)); // here we return the userRenter02 id the user id is passed

        // Now we pass it to the uploadRoomImage method where it will throw a Runtime Exception
        try{
            roomImageServiceImpl.uploadRoomImages(1L, List.of(file),"user456");
        }
        catch (RuntimeException e){
            assertEquals("You do not own this room",e.getMessage());

        }
    }







    @Test
    void testFetchRoomImage(){

    }
}
