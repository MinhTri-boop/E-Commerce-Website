package com.hexashop.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.lessThanOrEqualTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureMockMvc
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllProducts_DefaultPagination() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.products", hasSize(lessThanOrEqualTo(9))))
                .andExpect(jsonPath("$.products", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.pagination", is(notNullValue())))
                .andExpect(jsonPath("$.pagination.currentPage", is(1)))
                .andExpect(jsonPath("$.pagination.totalItems", is(12)));
    }

    @Test
    void getProducts_FilterByCategory() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/products")
                        .param("category", "men"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.products", hasSize(greaterThan(0))))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        JsonNode products = objectMapper.readTree(responseBody).get("products");

        for (JsonNode product : products) {
            assertTrue("men".equals(product.get("category").asText()),
                    "All returned products should have category 'men', but found: "
                            + product.get("category").asText());
        }
    }

    @Test
    void getProducts_SortByPriceAsc() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/products")
                        .param("sortBy", "price-asc")
                        .param("limit", "12"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.products", hasSize(greaterThan(0))))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        JsonNode products = objectMapper.readTree(responseBody).get("products");

        double previousPrice = 0.0;
        for (JsonNode product : products) {
            double currentPrice = product.get("price").asDouble();
            assertTrue(currentPrice >= previousPrice,
                    "Products should be sorted by price ascending. Found " + currentPrice
                            + " after " + previousPrice);
            previousPrice = currentPrice;
        }
    }

    @Test
    void getProducts_SearchByName() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/products")
                        .param("search", "leather"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.products", hasSize(greaterThan(0))))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        JsonNode products = objectMapper.readTree(responseBody).get("products");

        for (JsonNode product : products) {
            String name = product.get("name").asText().toLowerCase();
            assertTrue(name.contains("leather"),
                    "Search results should contain 'leather' in name, but found: " + name);
        }
    }

    @Test
    void getProductById_Success() throws Exception {
        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is(notNullValue())))
                .andExpect(jsonPath("$.price", is(notNullValue())))
                .andExpect(jsonPath("$.category", is(notNullValue())));
    }

    @Test
    void getProductById_NotFound_Returns404() throws Exception {
        mockMvc.perform(get("/api/products/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", is(true)))
                .andExpect(jsonPath("$.message", is(notNullValue())));
    }
}
