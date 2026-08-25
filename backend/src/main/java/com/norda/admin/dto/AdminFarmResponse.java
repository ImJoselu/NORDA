package com.norda.admin.dto;

import com.norda.producer.Farm;

import java.util.UUID;

public record AdminFarmResponse(
        UUID id,
        String name,
        String slug,
        UUID producerId,
        String producerName,
        int altitudeM
) {
    public static AdminFarmResponse from(Farm f) {
        return new AdminFarmResponse(f.getId(), f.getName(), f.getSlug(), f.getProducer().getId(), f.getProducer().getName(), f.getAltitudeM());
    }
}
