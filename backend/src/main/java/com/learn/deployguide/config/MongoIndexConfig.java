package com.learn.deployguide.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;

@Configuration
public class MongoIndexConfig {

    @Bean
    public CommandLineRunner createIndexes(MongoTemplate mongoTemplate) {
    return args -> {
            mongoTemplate.indexOps("stacks")
                    .ensureIndex(new Index().on("order", Sort.Direction.ASC));
            mongoTemplate.indexOps("steps")
                    .ensureIndex(new Index()
                            .on("stackId", Sort.Direction.ASC)
                            .on("order", Sort.Direction.ASC));
        };
    }
}
