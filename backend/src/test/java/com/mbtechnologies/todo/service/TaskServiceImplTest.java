package com.mbtechnologies.todo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mbtechnologies.todo.domain.Task;
import com.mbtechnologies.todo.domain.TaskStatus;
import com.mbtechnologies.todo.dto.request.CreateTaskRequest;
import com.mbtechnologies.todo.exception.TaskNotFoundException;
import com.mbtechnologies.todo.mapper.TaskMapper;
import com.mbtechnologies.todo.repository.TaskRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    private final TaskMapper taskMapper = new TaskMapper();

    @InjectMocks
    private TaskServiceImpl taskService;

    @BeforeEach
    void setUp() {
        taskService = new TaskServiceImpl(taskRepository, taskMapper);
    }

    @Test
    void createsTaskWithTrimmedFields() {
        Task persisted = task(" Build portfolio ", " Ship a polished task flow ", TaskStatus.PENDING, 1L, Instant.parse("2026-03-17T10:15:30Z"));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task candidate = invocation.getArgument(0, Task.class);
            ReflectionTestUtils.setField(candidate, "id", 1L);
            ReflectionTestUtils.setField(candidate, "createdAt", Instant.parse("2026-03-17T10:15:30Z"));
            ReflectionTestUtils.setField(candidate, "updatedAt", Instant.parse("2026-03-17T10:15:30Z"));
            return candidate;
        });

        var response = taskService.createTask(new CreateTaskRequest("  Build portfolio  ", "  Ship a polished task flow  "));

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.title()).isEqualTo("Build portfolio");
        assertThat(response.description()).isEqualTo("Ship a polished task flow");
        assertThat(response.status()).isEqualTo("PENDING");
    }

    @Test
    void returnsLatestFiveIncompleteTasksInOrder() {
        List<Task> tasks = List.of(
                task("Task 6", "Desc 6", TaskStatus.PENDING, 6L, Instant.parse("2026-03-17T10:06:00Z")),
                task("Task 5", "Desc 5", TaskStatus.PENDING, 5L, Instant.parse("2026-03-17T10:05:00Z")),
                task("Task 4", "Desc 4", TaskStatus.PENDING, 4L, Instant.parse("2026-03-17T10:04:00Z")),
                task("Task 3", "Desc 3", TaskStatus.PENDING, 3L, Instant.parse("2026-03-17T10:03:00Z")),
                task("Task 2", "Desc 2", TaskStatus.PENDING, 2L, Instant.parse("2026-03-17T10:02:00Z"))
        );
        when(taskRepository.findTop5ByStatusOrderByCreatedAtDescIdDesc(TaskStatus.PENDING)).thenReturn(tasks);

        var response = taskService.getLatestIncompleteTasks();

        assertThat(response).hasSize(5);
        assertThat(response).extracting("id").containsExactly(6L, 5L, 4L, 3L, 2L);
    }

    @Test
    void excludesCompletedTasksFromVisibleListing() {
        when(taskRepository.findTop5ByStatusOrderByCreatedAtDescIdDesc(TaskStatus.PENDING))
                .thenReturn(List.of(task("Task 1", "Desc 1", TaskStatus.PENDING, 1L, Instant.now())));

        var response = taskService.getLatestIncompleteTasks();

        assertThat(response).allMatch(task -> task.status().equals("PENDING"));
    }

    @Test
    void marksTaskAsCompleted() {
        Task task = task("Task 1", "Desc 1", TaskStatus.PENDING, 1L, Instant.parse("2026-03-17T10:00:00Z"));
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);

        var response = taskService.completeTask(1L);

        assertThat(response.status()).isEqualTo("COMPLETED");
        verify(taskRepository).save(task);
    }

    @Test
    void throwsNotFoundWhenCompletingMissingTask() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.completeTask(99L))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessage("Task with id 99 was not found");
    }

    private Task task(String title, String description, TaskStatus status, Long id, Instant createdAt) {
        Task task = new Task(title, description, status);
        ReflectionTestUtils.setField(task, "id", id);
        ReflectionTestUtils.setField(task, "createdAt", createdAt);
        ReflectionTestUtils.setField(task, "updatedAt", createdAt);
        return task;
    }
}

