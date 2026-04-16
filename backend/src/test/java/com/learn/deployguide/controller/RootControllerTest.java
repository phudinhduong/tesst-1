package com.learn.deployguide.controller;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class RootControllerTest {

    private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new RootController())
            .build();

    @Test
    void rootReturnsServiceLinks() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"))
                .andExpect(jsonPath("$.health").value("/api/v1/health"))
                .andExpect(jsonPath("$.stacks").value("/api/v1/stacks"));
    }
}