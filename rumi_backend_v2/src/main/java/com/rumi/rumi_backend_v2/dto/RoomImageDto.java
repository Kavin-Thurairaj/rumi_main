package com.rumi.rumi_backend_v2.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RoomImageDto {
    private Long imageId;
    private String imageUrl;
}
