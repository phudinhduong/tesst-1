package com.learn.deployguide.dto;

import java.util.List;

public record StepResponse(
        String id,
        String stackId,
        int order,
        String title,
        String description,
        List<String> commands,
        String imagePath
) {
}
