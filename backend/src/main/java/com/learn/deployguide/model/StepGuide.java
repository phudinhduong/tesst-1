package com.learn.deployguide.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "steps")
public class StepGuide {

    @Id
    private String id;
    private String stackId;
    private int order;
    private String title;
    private String description;
    private List<String> commands;
    private String imagePath;

    public StepGuide() {
    }

    public StepGuide(String stackId, int order, String title, String description, List<String> commands, String imagePath) {
        this.stackId = stackId;
        this.order = order;
        this.title = title;
        this.description = description;
        this.commands = commands;
        this.imagePath = imagePath;
    }

    public String getId() {
        return id;
    }

    public String getStackId() {
        return stackId;
    }

    public void setStackId(String stackId) {
        this.stackId = stackId;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getCommands() {
        return commands;
    }

    public void setCommands(List<String> commands) {
        this.commands = commands;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}
