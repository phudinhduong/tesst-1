package com.learn.deployguide.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.learn.deployguide.model.StepGuide;

public interface StepRepository extends MongoRepository<StepGuide, String> {
    List<StepGuide> findByStackIdOrderByOrderAsc(String stackId);
}
