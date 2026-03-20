package com.rumi.rumi_backend_v2.service.impl;

import com.rumi.rumi_backend_v2.dto.RoomCreateRequest;
import com.rumi.rumi_backend_v2.dto.RoomDetailResponse;
import com.rumi.rumi_backend_v2.dto.RoomUpdateRequest;
import com.rumi.rumi_backend_v2.entity.*;
import com.rumi.rumi_backend_v2.enums.RoleName;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import com.rumi.rumi_backend_v2.repo.*;
import com.rumi.rumi_backend_v2.service.RoomService;
import com.rumi.rumi_backend_v2.util.SupabaseAuthService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

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
    private final SupabaseAuthService supabaseAuthService;

    @Override
    @Transactional
    public Long createRoom(RoomCreateRequest dto, String authHeader) {
        String userId = supabaseAuthService.getUserId(authHeader);
        User user = userRepo.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        if (user.getRole() != RoleName.RENTER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only renters can create rooms");
        }
        // Build RoomDetail
        RoomDetail room = new RoomDetail();
        room.setRenter(user);
        room.setRoomTitle(dto.getRoomTitle());
        room.setRoomDescription(dto.getRoomDescription());
        room.setGenderAllowed(dto.getGenderAllowed());
        room.setMaxRoommates(dto.getMaxRoommates());
        room.setRoomStatus(dto.getRoomStatus() != null ? dto.getRoomStatus() : RoomStatus.AVAILABLE);
        room = roomRepo.save(room);
        // Address
        Address address = new Address();
        RoomCreateRequest.AddressDto a = dto.getAddress();
        address.setRoom(room);
        address.setHouseNumber(a.getHouseNumber());
        address.setAddressLine(a.getAddressLine());
        address.setCity(a.getCity());
        address.setCountry(a.getCountry());
        address.setMapUrl(a.getMapUrl());
        addressRepo.save(address);
        // Price
        RoomPrice price = new RoomPrice();
        RoomCreateRequest.PriceDto p = dto.getPrice();
        price.setRoom(room);
        price.setAmount(p.getAmount());
        price.setAdvance(p.getAdvance());
        price.setBillingCycle(p.getBillingCycle());
        roomPriceRepo.save(price);
        // Amenities
        List<Amenity> amenities = amenityRepo.findByAmenityIdIn(dto.getAmenityIds());
        room.setAmenities(new java.util.HashSet<>(amenities));
        // Rules
        List<Rule> rules = ruleRepo.findByRuleIdIn(dto.getRuleIds());
        room.setRules(new java.util.HashSet<>(rules));
        // Payment Conditions
        List<PaymentCondition> paymentConditions = paymentConditionRepo.findByConditionIdIn(dto.getPaymentConditionIds());
        room.setPaymentConditions(new java.util.HashSet<>(paymentConditions));
        roomRepo.save(room);
        return room.getRoomId();
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
                        .map(pc -> RoomDetailResponse.PaymentConditionDto.builder().conditionId(pc.getConditionId()).name(pc.getConditionName()).build())
                        .collect(Collectors.toList()))
                .renterId(room.getRenter() != null ? room.getRenter().getUserId() : null)
                .imageUrls(null) // To be filled by RoomImageService if needed
                .build();
    }
}
