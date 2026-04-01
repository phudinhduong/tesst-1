package com.learn.deployguide.dto;

public record StackResponse(
        String id,
        String key,
        String name,
        String description,
        int order
) {
}
