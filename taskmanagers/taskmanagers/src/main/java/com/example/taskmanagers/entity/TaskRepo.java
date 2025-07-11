package com.example.taskmanagers.entity;

import com.example.taskmanagers.entity.Task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepo extends JpaRepository<Task, Long> {
	List<Task> findByEmail(String email);
}

