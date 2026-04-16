package com.learn.deployguide.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.learn.deployguide.dto.StackResponse;
import com.learn.deployguide.dto.StepResponse;
import com.learn.deployguide.service.GuideService;

@RestController
@RequestMapping("/api/v1")
public class GuideController {

    private final GuideService guideService;

    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of(
                "status", "ok",
                "health", "/api/v1/health",
                "stacks", "/api/v1/stacks");
    }

    @GetMapping("/stacks")
    public List<StackResponse> getStacks() {
        return guideService.getStacks();
    }

    @GetMapping("/steps")
    public List<StepResponse> getSteps(@RequestParam(required = false) String stackId) {
        return guideService.getSteps(stackId);
    }

    @GetMapping("/health")
    public String health() {
        return "ok";
    }
}
