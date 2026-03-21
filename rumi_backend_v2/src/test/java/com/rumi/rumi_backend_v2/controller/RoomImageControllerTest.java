package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.service.impl.RoomImageServiceImpl;
import com.rumi.rumi_backend_v2.util.SupabaseAuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;


import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
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
    void testUploadImageSuccess() throws Exception{
        // Here we mock the image input a multipart image.
        MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "fake-image".getBytes());
        // here we mock the bearer token
        when(supabaseAuthService.getUserId("valid-token")).thenReturn("user123");

        //here we create the api endpoint in the test server
        mockMvc.perform(
                // here we create the endpoint path with file and bearer token and room id in the request param
                multipart("/api/rooms/1/images").file(file).header("Authorization", "Bearer valid-token"))
                .andExpect(status().isCreated()) //here we check the status is created 200.
                .andExpect(jsonPath("$.message").value("Room Image Added")); //here the response entity message we check

    }

}
