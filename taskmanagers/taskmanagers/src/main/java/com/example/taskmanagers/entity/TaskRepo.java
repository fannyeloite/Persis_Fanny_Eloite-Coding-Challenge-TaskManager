package com.example.taskmanagers.entity;

import com.example.taskmanagers.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepo extends JpaRepository<Task, Long> {
}

