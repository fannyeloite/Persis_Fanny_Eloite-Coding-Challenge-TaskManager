package com.example.taskmanagers.controller;

import com.example.taskmanagers.config.JwtUtil;
import com.example.taskmanagers.dto.AuthResponse;
import com.example.taskmanagers.dto.LoginRequest;
import com.example.taskmanagers.entity.user;
import com.example.taskmanagers.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserControllerAPI {


@Autowired
private UserService userService;

@Autowired
private AuthenticationManager authenticationManager;

@Autowired
private JwtUtil jwtUtil;

// 🔐 REGISTER
@PostMapping
public ResponseEntity<user> addUser(@RequestBody user u) {
    if (userService.userExists(u.getEmail())) {
        return new ResponseEntity<>(HttpStatus.CONFLICT);
    }
    user created = userService.addUser(u);
    return new ResponseEntity<>(created, HttpStatus.CREATED);
}

// 🔐 LOGIN
@PostMapping("/auth/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    try {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        if (auth.isAuthenticated()) {
            user u = userService.getUserByEmail(request.getEmail()).orElseThrow();
            String token = jwtUtil.generateToken(u.getEmail(), u.getRole());
            return ResponseEntity.ok(new AuthResponse(token, u.getRole()));
        }
    } catch (BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
}

// ✨ Other User CRUD endpoints (already in your code)



@GetMapping
public ResponseEntity<List<user>> getUsers() {
    return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
}

@GetMapping("/{email}")
public ResponseEntity<user> getUser(@PathVariable String email) {
    Optional<user> opt = userService.getUserByEmail(email);
    return opt.map(u -> new ResponseEntity<>(u, HttpStatus.OK))
              .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
}

@PutMapping("/{email}")
public ResponseEntity<user> updateUser(@PathVariable String email, @RequestBody user u) {
    Optional<user> opt = userService.getUserByEmail(email);
    if (opt.isPresent()) {
        return new ResponseEntity<>(userService.updateUser(email, u), HttpStatus.OK);
    } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

@DeleteMapping("/{email}")
public ResponseEntity<String> deleteUser(@PathVariable String email) {
    boolean deleted = userService.deleteUser(email);
    return deleted ?
            new ResponseEntity<>("User deleted successfully", HttpStatus.OK) :
            new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
}
}