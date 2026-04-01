package com.learn.deployguide.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.learn.deployguide.model.StackGuide;

public interface StackRepository extends MongoRepository<StackGuide, String> {
    Optional<StackGuide> findByKey(String key);
}
