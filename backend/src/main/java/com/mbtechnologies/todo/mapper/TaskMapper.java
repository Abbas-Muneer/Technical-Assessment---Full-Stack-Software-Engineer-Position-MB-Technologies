package com.mbtechnologies.todo.mapper;

import com.mbtechnologies.todo.domain.Task;
import com.mbtechnologies.todo.dto.response.TaskResponse;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus().name(),
                task.getCreatedAt()
        );
    }
}

