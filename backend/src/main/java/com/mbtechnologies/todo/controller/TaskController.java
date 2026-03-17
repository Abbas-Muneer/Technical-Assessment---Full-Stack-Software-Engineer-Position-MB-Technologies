package com.mbtechnologies.todo.controller;

import com.mbtechnologies.todo.dto.request.CreateTaskRequest;
import com.mbtechnologies.todo.dto.response.TaskResponse;
import com.mbtechnologies.todo.service.TaskService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        TaskResponse createdTask = taskService.createTask(request);
        return ResponseEntity
                .created(URI.create("/api/tasks/" + createdTask.id()))
                .body(createdTask);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getLatestIncompleteTasks() {
        return ResponseEntity.ok(taskService.getLatestIncompleteTasks());
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskResponse> completeTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.completeTask(id));
    }
}

