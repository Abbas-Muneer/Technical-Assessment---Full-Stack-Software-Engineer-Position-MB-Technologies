package com.mbtechnologies.todo.service;

import com.mbtechnologies.todo.domain.Task;
import com.mbtechnologies.todo.domain.TaskStatus;
import com.mbtechnologies.todo.dto.request.CreateTaskRequest;
import com.mbtechnologies.todo.dto.response.TaskResponse;
import com.mbtechnologies.todo.exception.TaskNotFoundException;
import com.mbtechnologies.todo.mapper.TaskMapper;
import com.mbtechnologies.todo.repository.TaskRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public TaskServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
    }

    @Override
    public TaskResponse createTask(CreateTaskRequest request) {
        Task task = new Task(
                normalize(request.title()),
                normalize(request.description()),
                TaskStatus.PENDING
        );
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getLatestIncompleteTasks() {
        return taskRepository.findTop5ByStatusOrderByCreatedAtDescIdDesc(TaskStatus.PENDING)
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Override
    public TaskResponse completeTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        task.setStatus(TaskStatus.COMPLETED);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }
}

