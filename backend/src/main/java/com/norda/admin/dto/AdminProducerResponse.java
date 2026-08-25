package com.norda.admin.dto;

import com.norda.producer.Producer;

import java.util.UUID;

public record AdminProducerResponse(
        UUID id,
        String name,
        String slug,
        UUID regionId,
        String regionName,
        String description
) {
    public static AdminProducerResponse from(Producer p) {
        return new AdminProducerResponse(
                p.getId(), p.getName(), p.getSlug(), p.getRegion().getId(), p.getRegion().getName(), p.getDescription()
        );
    }
}

