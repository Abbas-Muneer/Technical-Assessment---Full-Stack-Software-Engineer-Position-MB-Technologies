package com.mbtechnologies.todo.repository;

import com.mbtechnologies.todo.domain.Task;
import com.mbtechnologies.todo.domain.TaskStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findTop5ByStatusOrderByCreatedAtDescIdDesc(TaskStatus status);
}

