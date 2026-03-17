package com.mbtechnologies.todo.dto.response;

import java.time.Instant;

public record TaskResponse(
        Long id,
        String title,
        String description,
        String status,
        Instant createdAt
) {
}

