package com.rumi.rumi_backend_v2.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Locale;

@Converter(autoApply = true)
public class UserStatusConverter implements AttributeConverter<UserStatus, String> {

    @Override
    public String convertToDatabaseColumn(UserStatus attribute) {
        if (attribute == null) {
            return null;
        }
        return switch (attribute) {
            case ACTIVE -> "active";
            case INACTIVE -> "inactive";
            // Match legacy DB enum value.
            case SUSPENDED -> "banned";
            case DELETED -> "banned";
        };
    }

    @Override
    public UserStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        String normalized = dbData.trim();
        if (normalized.isEmpty()) {
            return null;
        }
        return switch (normalized.toLowerCase(Locale.ROOT)) {
            case "active" -> UserStatus.ACTIVE;
            case "inactive" -> UserStatus.INACTIVE;
            case "banned", "suspended" -> UserStatus.SUSPENDED;
            case "deleted" -> UserStatus.SUSPENDED;
            default -> UserStatus.fromValue(normalized);
        };
    }
}
