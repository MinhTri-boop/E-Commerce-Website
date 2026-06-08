package com.hexashop.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    private static final String TEST_EMAIL = "testuser@example.com";

    @Test
    void generateToken_ReturnsNonNullNonEmptyToken() {
        String token = jwtService.generateToken(TEST_EMAIL);

        assertNotNull(token, "Generated token should not be null");
        assertFalse(token.isBlank(), "Generated token should not be blank");
    }

    @Test
    void extractUsername_ReturnsCorrectEmail() {
        String token = jwtService.generateToken(TEST_EMAIL);

        String extractedEmail = jwtService.extractUsername(token);

        assertEquals(TEST_EMAIL, extractedEmail, "Extracted username should match the email used to generate the token");
    }

    @Test
    void isTokenValid_ReturnsTrueForFreshToken() {
        String token = jwtService.generateToken(TEST_EMAIL);

        boolean valid = jwtService.isTokenValid(token);

        assertTrue(valid, "A freshly generated token should be valid");
    }

    @Test
    void isTokenValid_ReturnsFalseForTamperedToken() {
        String token = jwtService.generateToken(TEST_EMAIL);

        // Tamper with the token by altering characters in the signature (last segment)
        String tamperedToken = token.substring(0, token.length() - 5) + "XXXXX";

        boolean valid = jwtService.isTokenValid(tamperedToken);

        assertFalse(valid, "A tampered token should not be valid");
    }
}
