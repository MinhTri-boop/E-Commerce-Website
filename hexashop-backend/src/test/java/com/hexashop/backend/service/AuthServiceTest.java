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

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    // --- Register tests ---

    @Test
    void register_Success_WhenEmailDoesNotExist() {
        RegisterRequest request = new RegisterRequest();
        request.setName("John Doe");
        request.setEmail("john@example.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        User savedUser = new User("John Doe", "john@example.com", "encodedPassword");
        savedUser.setId(1L);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken("john@example.com")).thenReturn("jwt-token-123");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt-token-123", response.getToken());
        assertNotNull(response.getUser());
        assertEquals("john@example.com", response.getUser().getEmail());
        assertEquals("John Doe", response.getUser().getName());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsBadRequestException() {
        RegisterRequest request = new RegisterRequest();
        request.setName("John Doe");
        request.setEmail("john@example.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> authService.register(request));

        assertEquals("Email already registered", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    // --- Login tests ---

    @Test
    void login_Success_WhenCredentialsAreValid() {
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("password123");

        User user = new User("John Doe", "john@example.com", "encodedPassword");
        user.setId(1L);
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken("john@example.com")).thenReturn("jwt-token-456");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token-456", response.getToken());
        assertEquals("john@example.com", response.getUser().getEmail());
    }

    @Test
    void login_InvalidEmail_ThrowsBadRequestException() {
        LoginRequest request = new LoginRequest();
        request.setEmail("nonexistent@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> authService.login(request));

        assertEquals("Invalid email or password", exception.getMessage());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void login_InvalidPassword_ThrowsBadRequestException() {
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("wrongPassword");

        User user = new User("John Doe", "john@example.com", "encodedPassword");
        user.setId(1L);
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> authService.login(request));

        assertEquals("Invalid email or password", exception.getMessage());
        verify(jwtService, never()).generateToken(anyString());
    }

    // --- getCurrentUser tests ---

    @Test
    void getCurrentUser_Success_WhenUserFound() {
        User user = new User("John Doe", "john@example.com", "encodedPassword");
        user.setId(1L);
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        UserDto userDto = authService.getCurrentUser("john@example.com");

        assertNotNull(userDto);
        assertEquals(1L, userDto.getId());
        assertEquals("John Doe", userDto.getName());
        assertEquals("john@example.com", userDto.getEmail());
    }

    @Test
    void getCurrentUser_NotFound_ThrowsResourceNotFoundException() {
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> authService.getCurrentUser("ghost@example.com"));
    }
}
