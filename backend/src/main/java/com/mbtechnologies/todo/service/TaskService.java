package com.mbtechnologies.todo.service;

import com.mbtechnologies.todo.dto.request.CreateTaskRequest;
import com.mbtechnologies.todo.dto.response.TaskResponse;
import java.util.List;

public interface TaskService {

    TaskResponse createTask(CreateTaskRequest request);

    List<TaskResponse> getLatestIncompleteTasks();

    TaskResponse completeTask(Long id);
}

