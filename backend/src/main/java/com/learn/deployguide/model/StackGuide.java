package com.learn.deployguide.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "stacks")
public class StackGuide {

    @Id
    private String id;
    private String key;
    private String name;
    private String description;
    private int order;

    public StackGuide() {
    }

    public StackGuide(String key, String name, String description, int order) {
        this.key = key;
        this.name = name;
        this.description = description;
        this.order = order;
    }

    public String getId() {
        return id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }
}
