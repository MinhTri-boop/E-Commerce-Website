package com.hexashop.backend.service;

import com.hexashop.backend.dto.AuthResponse;
import com.hexashop.backend.dto.LoginRequest;
import com.hexashop.backend.dto.RegisterRequest;
import com.hexashop.backend.dto.UserDto;
import com.hexashop.backend.exception.BadRequestException;
import com.hexashop.backend.exception.ResourceNotFoundException;
import com.hexashop.backend.model.User;
import com.hexashop.backend.repository.UserRepository;
import com.hexashop.backend.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser.getEmail());
        UserDto userDto = UserDto.fromUser(savedUser);

        return new AuthResponse("User registered successfully", userDto, token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());
        UserDto userDto = UserDto.fromUser(user);

        return new AuthResponse("Login successful", userDto, token);
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return UserDto.fromUser(user);
    }
}
