package com.example.taskmanagers.service;

import com.example.taskmanagers.entity.user;
import com.example.taskmanagers.entity.userRepo;
import com.example.taskmanagers.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {


@Autowired
private userRepo userRepo;

@Autowired
private BCryptPasswordEncoder encoder;

@Override
public user addUser(user u) {
    u.setPassword(encoder.encode(u.getPassword())); // hash password
    return userRepo.save(u);
}

public List<user> getAllUsers() {
    return userRepo.findAll();
}

public Optional<user> getUserByEmail(String email) {
    return userRepo.findById(email);
}

public user updateUser(String email, user u) {
    u.setEmail(email);
    return userRepo.save(u);
}

public boolean deleteUser(String email) {
    if (userRepo.existsById(email)) {
        userRepo.deleteById(email);
        return true;
    }
    return false;
}
@Override
public boolean userExists(String email) {
    return userRepo.existsById(email);
}
}