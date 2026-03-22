package com.rumi.rumi_backend_v2.controller;

import com.rumi.rumi_backend_v2.dto.RoomCreateRequest;
import com.rumi.rumi_backend_v2.dto.RoomDetailResponse;
import com.rumi.rumi_backend_v2.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RoomController {
    private final RoomService roomService;
    private static final Logger log = LoggerFactory.getLogger(RoomController.class);

    @PostMapping
    public ResponseEntity<?> createRoom(@Valid @RequestBody RoomCreateRequest request,
                                        @RequestHeader(value = "Authorization") String authHeader) {
        try {
            log.info("Creating room with title: {}", request.getRoomTitle());
            Long roomId = roomService.createRoom(request, authHeader);
            log.info("Room created successfully with ID: {}", roomId);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("roomId", roomId));
        } catch (ResponseStatusException e) {
            log.warn("ResponseStatusException: {}", e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
        } catch (Exception e) {
            log.error("Room creation failed with exception: {}", e.getMessage(), e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : "Room creation failed";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", errorMsg,
                "detail", e.getClass().getSimpleName()
            ));
        }
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable Long roomId) {
        try {
            RoomDetailResponse response = roomService.getRoom(roomId);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to fetch room details"));
        }
    }
}
