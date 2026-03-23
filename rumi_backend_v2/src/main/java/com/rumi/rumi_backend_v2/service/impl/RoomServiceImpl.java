package com.rumi.rumi_backend_v2.service.impl;

import com.rumi.rumi_backend_v2.dto.RoomCreateRequest;
import com.rumi.rumi_backend_v2.dto.RoomDetailResponse;
import com.rumi.rumi_backend_v2.dto.RoomUpdateRequest;
import com.rumi.rumi_backend_v2.entity.*;
import com.rumi.rumi_backend_v2.enums.RoleName;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import com.rumi.rumi_backend_v2.enums.UserStatus;
import com.rumi.rumi_backend_v2.repo.*;
import com.rumi.rumi_backend_v2.service.RoomService;
import com.rumi.rumi_backend_v2.util.SupabaseAuthService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomRepo roomRepo;
    private final AddressRepo addressRepo;
    private final RoomPriceRepo roomPriceRepo;
    private final AmenityRepo amenityRepo;
    private final RuleRepo ruleRepo;
    private final PaymentConditionRepo paymentConditionRepo;
    private final UserRepo userRepo;
    private final RoomImageRepo roomImageRepo;
    private final SupabaseAuthService supabaseAuthService;

    @Override
    @Transactional
    public Long createRoom(RoomCreateRequest dto, String authHeader) {
        // Get authenticated user
        String userId = supabaseAuthService.getUserId(authHeader);
        User user = userRepo.findById(userId).orElseGet(() -> {
            // Auto-create user if not found (for users who logged in but have no profile)
            User newUser = User.builder()
                    .supabaseUid(userId)
                    .email("user-" + userId.substring(0, 8) + "@rumi.local")
                    .full_name("Landlord")
                    .phone_number("auto-" + userId.substring(0, 11))
                    .role(RoleName.RENTER)
                    .status(UserStatus.ACTIVE)
                    .phone_verified(false)
                    .profile_complete(false)
                    .build();
            return userRepo.save(newUser);
        });
        
        if (user.getRole() != RoleName.RENTER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only renters can create rooms");
        }
        
        // Build RoomDetail
        RoomDetail room = new RoomDetail();
        room.setRenter(user);
        room.setRoomTitle(dto.getRoomTitle());
        room.setRoomDescription(dto.getRoomDescription());
        room.setGenderAllowed(dto.getGenderAllowed());
        room.setMaxRoommates(dto.getMaxRoommates() > 0 ? dto.getMaxRoommates() : 1);
        room.setRoomStatus(dto.getRoomStatus() != null ? dto.getRoomStatus() : RoomStatus.AVAILABLE);
        room.setRoomType(dto.getRoomType());
        room = roomRepo.save(room);
        
        // Address - handle null case
        if (dto.getAddress() != null) {
            Address address = new Address();
            RoomCreateRequest.AddressDto a = dto.getAddress();
            address.setRoom(room);
            address.setHouseNumber(a.getHouseNumber() != null ? a.getHouseNumber() : 1);
            address.setAddressLine(a.getAddressLine() != null ? a.getAddressLine() : "N/A");
            address.setCity(a.getCity() != null ? a.getCity() : "Unknown");
            address.setCountry(a.getCountry() != null ? a.getCountry() : "Unknown");
            address.setMapUrl(a.getMapUrl());
            addressRepo.save(address);
        }
        
        // Price - handle null case
        if (dto.getPrice() != null) {
            RoomPrice price = new RoomPrice();
            RoomCreateRequest.PriceDto p = dto.getPrice();
            price.setRoom(room);
            price.setAmount(p.getAmount() != null ? p.getAmount() : 0);
            price.setAdvance(p.getAdvance() != null ? p.getAdvance() : 0);
            price.setBillingCycle(p.getBillingCycle() != null ? p.getBillingCycle() : com.rumi.rumi_backend_v2.enums.BillingCycle.MONTHLY);
            roomPriceRepo.save(price);
        }
        
        // Amenities
        if (dto.getAmenityIds() != null && !dto.getAmenityIds().isEmpty()) {
            List<Amenity> amenities = amenityRepo.findByAmenityIdIn(dto.getAmenityIds());
            if (!amenities.isEmpty()) {
                room.setAmenities(new java.util.HashSet<>(amenities));
            }
        }
        
        // Rules
        if (dto.getRuleIds() != null && !dto.getRuleIds().isEmpty()) {
            List<Rule> rules = ruleRepo.findByRuleIdIn(dto.getRuleIds());
            if (!rules.isEmpty()) {
                room.setRules(new java.util.HashSet<>(rules));
            }
        }
        
        // Payment Conditions
        if (dto.getPaymentConditionIds() != null && !dto.getPaymentConditionIds().isEmpty()) {
            List<PaymentCondition> paymentConditions = paymentConditionRepo.findByConditionIdIn(dto.getPaymentConditionIds());
            if (!paymentConditions.isEmpty()) {
                room.setPaymentConditions(new java.util.HashSet<>(paymentConditions));
            }
        }
        
        roomRepo.save(room);
        return room.getRoomId();
    }

    @Override
    public List<RoomDetailResponse> getMyRooms(String authHeader) {
        String userId = supabaseAuthService.getUserId(authHeader);
        List<RoomDetail> rooms = roomRepo.findByRenter_SupabaseUid(userId);
        List<RoomDetailResponse> result = new ArrayList<>();
        for (RoomDetail room : rooms) {
            Address address = room.getAddress();
            RoomPrice price = room.getRoomPrice();
            List<String> imageUrls = roomImageRepo.findByRoom_RoomId(room.getRoomId())
                    .stream().map(RoomImage::getImageUrl).collect(Collectors.toList());
            result.add(RoomDetailResponse.builder()
                    .roomId(room.getRoomId())
                    .roomTitle(room.getRoomTitle())
                    .roomDescription(room.getRoomDescription())
                    .roomStatus(room.getRoomStatus())
                    .roomType(room.getRoomType())
                    .genderAllowed(room.getGenderAllowed())
                    .maxRoommates(room.getMaxRoommates())
                    .address(address == null ? null : RoomDetailResponse.AddressDto.builder()
                            .city(address.getCity())
                            .country(address.getCountry())
                            .addressLine(address.getAddressLine())
                            .houseNumber(address.getHouseNumber())
                            .build())
                    .price(price == null ? null : RoomDetailResponse.PriceDto.builder()
                            .amount(price.getAmount())
                            .advance(price.getAdvance())
                            .billingCycle(price.getBillingCycle())
                            .build())
                    .imageUrls(imageUrls)
                    .build());
        }
        return result;
    }

    @Override
    @Transactional
    public void deleteRoom(Long roomId, String authHeader) {
        String userId = supabaseAuthService.getUserId(authHeader);
        RoomDetail room = roomRepo.findByRoomId(roomId);
        if (room == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
        if (!room.getRenter().getSupabaseUid().equals(userId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this room");

        // 1. Clear ManyToMany join tables
        room.getAmenities().clear();
        room.getRules().clear();
        room.getPaymentConditions().clear();
        roomRepo.save(room);

        // 2. Delete images
        List<RoomImage> images = roomImageRepo.findByRoom_RoomId(roomId);
        roomImageRepo.deleteAll(images);

        // 3. Delete address and price (OneToOne, no cascade set)
        if (room.getAddress() != null) addressRepo.delete(room.getAddress());
        if (room.getRoomPrice() != null) roomPriceRepo.delete(room.getRoomPrice());

        // 4. Delete the room
        roomRepo.delete(room);
        log.info("Room {} deleted by user {}", roomId, userId);
    }

    @Override
    public RoomDetailResponse getRoom(Long roomId) {
        RoomDetail room = roomRepo.findByRoomId(roomId);
        if (room == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
        // Map to DTO
        Address address = room.getAddress();
        RoomPrice price = room.getRoomPrice();
        return RoomDetailResponse.builder()
                .roomId(room.getRoomId())
                .roomTitle(room.getRoomTitle())
                .roomDescription(room.getRoomDescription())
                .genderAllowed(room.getGenderAllowed())
                .maxRoommates(room.getMaxRoommates())
                .roomStatus(room.getRoomStatus())
                .roomType(room.getRoomType())
                .address(address == null ? null : RoomDetailResponse.AddressDto.builder()
                        .houseNumber(address.getHouseNumber())
                        .addressLine(address.getAddressLine())
                        .city(address.getCity())
                        .country(address.getCountry())
                        .mapUrl(address.getMapUrl())
                        .build())
                .price(price == null ? null : RoomDetailResponse.PriceDto.builder()
                        .amount(price.getAmount())
                        .advance(price.getAdvance())
                        .billingCycle(price.getBillingCycle())
                        .build())
                .amenities(room.getAmenities() == null ? null : room.getAmenities().stream()
                        .map(a -> RoomDetailResponse.AmenityDto.builder().amenityId(a.getAmenityId()).name(a.getAmenityName()).build())
                        .collect(Collectors.toList()))
                .rules(room.getRules() == null ? null : room.getRules().stream()
                        .map(r -> RoomDetailResponse.RuleDto.builder().ruleId(r.getRuleId()).name(r.getRuleName()).build())
                        .collect(Collectors.toList()))
                .paymentConditions(room.getPaymentConditions() == null ? null : room.getPaymentConditions().stream()
                        .map(pc -> RoomDetailResponse.PaymentConditionDto.builder().conditionId(pc.getConditionId()).name(pc.getConditionName().name()).build())
                        .collect(Collectors.toList()))
                .renterId(room.getRenter() != null ? room.getRenter().getUserId() : null)
                .imageUrls(null) // To be filled by RoomImageService if needed
                .build();
    }
}
