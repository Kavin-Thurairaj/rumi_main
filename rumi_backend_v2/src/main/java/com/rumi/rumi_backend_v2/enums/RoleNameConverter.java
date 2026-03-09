package com.rumi.rumi_backend_v2.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Locale;

@Converter(autoApply = true)
public class RoleNameConverter implements AttributeConverter<RoleName, String> {

    @Override
    public String convertToDatabaseColumn(RoleName attribute) {
        if (attribute == null) {
            return null;
        }
        // Store lowercase values to align with DB constraints and seeded data.
        return attribute.name().toLowerCase(Locale.ROOT);
    }

    @Override
    public RoleName convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        String normalized = dbData.trim();
        if (normalized.isEmpty()) {
            return null;
        }
        return RoleName.fromValue(normalized);
    }
}
