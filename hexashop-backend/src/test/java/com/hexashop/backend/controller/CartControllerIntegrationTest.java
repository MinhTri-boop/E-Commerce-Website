package com.hexashop.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hexashop.backend.dto.CartItemRequest;
import com.hexashop.backend.dto.RegisterRequest;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class CartControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Helper to register a user and return the JWT token.
     */
    private String registerAndGetToken(String name, String email, String password) throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName(name);
        request.setEmail(email);
        request.setPassword(password);

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        return objectMapper.readTree(responseBody).get("token").asText();
    }

    @Test
    void getCart_Authenticated_ReturnsEmptyCart() throws Exception {
        String token = registerAndGetToken("Cart User", "cartuser@example.com", "password123");

        mockMvc.perform(get("/api/cart")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cartItems", hasSize(0)));
    }

    @Test
    void addToCart_Success() throws Exception {
        String token = registerAndGetToken("Cart User", "cartuser@example.com", "password123");

        CartItemRequest cartRequest = new CartItemRequest();
        cartRequest.setProductId(1L);
        cartRequest.setQuantity(2);

        mockMvc.perform(post("/api/cart")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cartRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cartItems", hasSize(1)))
                .andExpect(jsonPath("$.cartItems[0].productId", is(1)))
                .andExpect(jsonPath("$.cartItems[0].quantity", is(2)))
                .andExpect(jsonPath("$.cartItems[0].product.name").isNotEmpty())
                .andExpect(jsonPath("$.cartItems[0].product.price").isNumber());
    }

    @Test
    void updateCartItem_Quantity() throws Exception {
        String token = registerAndGetToken("Cart User", "cartuser@example.com", "password123");

        // Add item first
        CartItemRequest addRequest = new CartItemRequest();
        addRequest.setProductId(1L);
        addRequest.setQuantity(2);

        mockMvc.perform(post("/api/cart")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cartItems[0].quantity", is(2)));

        // Update quantity
        CartItemRequest updateRequest = new CartItemRequest();
        updateRequest.setProductId(1L);
        updateRequest.setQuantity(5);

        mockMvc.perform(post("/api/cart")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cartItems", hasSize(1)))
                .andExpect(jsonPath("$.cartItems[0].productId", is(1)))
                .andExpect(jsonPath("$.cartItems[0].quantity", is(5)));
    }

    @Test
    void getCart_Unauthenticated_Returns401Or403() throws Exception {
        mockMvc.perform(get("/api/cart"))
                .andExpect(status().is4xxClientError());
    }
}
