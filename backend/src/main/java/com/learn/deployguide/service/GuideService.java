package com.learn.deployguide.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.learn.deployguide.dto.StackResponse;
import com.learn.deployguide.dto.StepResponse;
import com.learn.deployguide.model.StepGuide;
import com.learn.deployguide.repository.StackRepository;
import com.learn.deployguide.repository.StepRepository;

@Service
public class GuideService {

    private final StackRepository stackRepository;
    private final StepRepository stepRepository;

    public GuideService(StackRepository stackRepository, StepRepository stepRepository) {
        this.stackRepository = stackRepository;
        this.stepRepository = stepRepository;
    }

    public List<StackResponse> getStacks() {
        return stackRepository.findAll(Sort.by(Sort.Direction.ASC, "order")).stream()
                .map(stack -> new StackResponse(
                        stack.getId(),
                        stack.getKey(),
                        stack.getName(),
                        stack.getDescription(),
                        stack.getOrder()))
                .toList();
    }

    public List<StepResponse> getSteps(String stackId) {
                List<StepGuide> steps;

                if (stackId == null || stackId.isBlank()) {
                        steps = stepRepository.findAll(Sort.by(Sort.Direction.ASC, "order"));
                } else {
                        if (!stackRepository.existsById(stackId)) {
                                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Stack not found for provided stackId");
                        }
                        steps = stepRepository.findByStackIdOrderByOrderAsc(stackId);
                }

        return steps.stream()
                .map(step -> new StepResponse(
                        step.getId(),
                        step.getStackId(),
                        step.getOrder(),
                        step.getTitle(),
                        step.getDescription(),
                        step.getCommands(),
                        step.getImagePath()))
                .toList();
    }
}
