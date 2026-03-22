package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.dto.RoomImageDto;
import com.rumi.rumi_backend_v2.service.impl.RoomImageServiceImpl;
import com.rumi.rumi_backend_v2.util.SupabaseAuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;


import java.util.List;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RoomImageController.class)  // This is an MVC component where you can use this to test controllers faster
public class RoomImageControllerTest {

    @Autowired
    private MockMvc mockMvc;  // This allows us to create test over https request in a test environment.

    @MockitoBean
    private RoomImageServiceImpl roomImageServiceImpl;

    @MockitoBean
    private SupabaseAuthService supabaseAuthService;

    @Test
    void testUploadImageSuccess() throws Exception {
        // Here we mock the image input a multipart image.
        MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "fake-image".getBytes());
        // here we mock the bearer token
        when(supabaseAuthService.getUserId("valid-token")).thenReturn("user123");

        //here we create the api endpoint in the test server
        mockMvc.perform(
                // here we create the endpoint path with file and bearer token and room id in the request param
                multipart("/api/rooms/1/images").file(file).header("Authorization", "Bearer valid-token"))
                .andExpect(status().isCreated()) //here we check the status is created 200.
                //.andDo(print())
                .andExpect(jsonPath("$.message").value("Room Image Added")); //here the response entity message we check

    }

    // HERE WE CHECK TEST AN ERROR CASE WHERE THE RENTER IS NOT AUTHORISED FOR ROOM IMAGE UPLOAD
    @Test
    void testUploadImageNoToken() throws Exception{
        // Here we mock the image input a multipart image.
        MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "fake-image".getBytes());

        mockMvc.perform(
                multipart("/api/rooms/1/images").file(file))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Missing or invalid Authorization header"));
    }

    // HERE WE HANDLE AN ERROR CASE WHERE THE USER TRY TO UPLOAD IMAGES BUT THE ROOM IS NOT FOUND.
    @Test
    void testUploadImageRoomNotFound() throws Exception{
        MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "fake-image".getBytes());
        when(supabaseAuthService.getUserId("valid-token")).thenReturn("user123");
        doThrow(new RuntimeException("Room not found"))
                .when(roomImageServiceImpl)
                .uploadRoomImages(anyLong(), anyList(), anyString());

        mockMvc.perform(
                multipart("/api/rooms/1/images").file(file).header("Authorization", "Bearer valid-token"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Room not found")); //here the response entity message we check

    }

    @Test
    void testUploadImageUserNotRenter() throws Exception {
        MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "fake-image".getBytes());
        when(supabaseAuthService.getUserId("valid-token")).thenReturn("user123");

        // here this runtime exception will be thrown when this method is called in the in this class.
        doThrow(new RuntimeException("Only renters can upload images"))
                .when(roomImageServiceImpl)
                .uploadRoomImages(anyLong(), anyList(), anyString());

        mockMvc.perform(
                multipart("/api/rooms/1/images").file(file).header("Authorization", "Bearer valid-token"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Only renters can upload images"));


    }

    // HERE WE TEST THAT THE MOCK IMAGE URL CAN BE ACCESSED AT THIS SPECIFIC GET API ENDPOINT ACCORDING TO THE ROOM ID
    @Test
    void testFetchRoomImageSuccessfully() throws Exception {
        List<RoomImageDto> mockList = List.of(
                RoomImageDto.builder().imageId(1L).imageUrl("url1").build(),
                RoomImageDto.builder().imageId(2L).imageUrl("url2").build()
        );

        // here if the room id is pass then this mocklist will be returned just for testing purpose.
        when(roomImageServiceImpl.fetchRoomImages(1L)).thenReturn(mockList);

        mockMvc.perform(get("/api/rooms/1/images"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].imageUrl").value("url1"));
    }

    @Test
    void testFetchRoomImageRoomNotFound() throws Exception {
        doThrow(new RuntimeException("Room not found"))
                .when(roomImageServiceImpl)
                .fetchRoomImages(anyLong());

        mockMvc.perform(get("/api/rooms/1/images"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Room not found"));
    }

}
