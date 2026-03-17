package com.mbtechnologies.todo.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mbtechnologies.todo.domain.Task;
import com.mbtechnologies.todo.domain.TaskStatus;
import com.mbtechnologies.todo.dto.request.CreateTaskRequest;
import com.mbtechnologies.todo.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class TaskControllerIntegrationTest {

    @Container
    static final MySQLContainer<?> MYSQL_CONTAINER = new MySQLContainer<>("mysql:8.0.36")
            .withDatabaseName("todo_test")
            .withUsername("test_user")
            .withPassword("test_password");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", MYSQL_CONTAINER::getJdbcUrl);
        registry.add("spring.datasource.username", MYSQL_CONTAINER::getUsername);
        registry.add("spring.datasource.password", MYSQL_CONTAINER::getPassword);
        registry.add("spring.flyway.url", MYSQL_CONTAINER::getJdbcUrl);
        registry.add("spring.flyway.user", MYSQL_CONTAINER::getUsername);
        registry.add("spring.flyway.password", MYSQL_CONTAINER::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void cleanUp() {
        taskRepository.deleteAll();
    }

    @Test
    void createsTask() throws Exception {
        CreateTaskRequest request = new CreateTaskRequest("Draft architecture", "Document the clean layers");

        mockMvc.perform(post("/api/tasks")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", org.hamcrest.Matchers.matchesPattern("/api/tasks/\\d+")))
                .andExpect(jsonPath("$.title", is("Draft architecture")))
                .andExpect(jsonPath("$.description", is("Document the clean layers")))
                .andExpect(jsonPath("$.status", is("PENDING")));
    }

    @Test
    void fetchesOnlyLatestFiveIncompleteTasks() throws Exception {
        for (int index = 1; index <= 6; index++) {
            taskRepository.save(new Task("Task " + index, "Desc " + index, TaskStatus.PENDING));
        }

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)))
                .andExpect(jsonPath("$[0].title", is("Task 6")))
                .andExpect(jsonPath("$[4].title", is("Task 2")));
    }

    @Test
    void completedTasksDoNotAppearInListing() throws Exception {
        taskRepository.save(new Task("Visible", "Still pending", TaskStatus.PENDING));
        taskRepository.save(new Task("Hidden", "Already completed", TaskStatus.COMPLETED));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Visible")));
    }

    @Test
    void marksTaskComplete() throws Exception {
        Task task = taskRepository.save(new Task("Ship feature", "Close the loop", TaskStatus.PENDING));

        mockMvc.perform(patch("/api/tasks/{id}/complete", task.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("COMPLETED")));
    }

    @Test
    void returnsNotFoundForMissingTask() throws Exception {
        mockMvc.perform(patch("/api/tasks/{id}/complete", 999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Task with id 999 was not found")));
    }
}
