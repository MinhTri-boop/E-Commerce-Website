package com.hexashop.backend.service;

import com.hexashop.backend.dto.CartItemRequest;
import com.hexashop.backend.dto.CartResponse;
import com.hexashop.backend.exception.ResourceNotFoundException;
import com.hexashop.backend.model.CartItem;
import com.hexashop.backend.model.Product;
import com.hexashop.backend.model.User;
import com.hexashop.backend.repository.CartItemRepository;
import com.hexashop.backend.repository.ProductRepository;
import com.hexashop.backend.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @InjectMocks
    private CartService cartService;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    private User createTestUser() {
        User user = new User("John Doe", "john@example.com", "encodedPassword");
        user.setId(1L);
        return user;
    }

    private Product createTestProduct() {
        Product product = new Product()
                .name("Classic Spring")
                .price(120.0)
                .category("men")
                .image("/images/men-01.jpg");
        product.setId(1L);
        return product;
    }

    // --- getCart tests ---

    @Test
    void getCart_Success_ReturnsCartResponse() {
        User user = createTestUser();
        Product product = createTestProduct();
        CartItem cartItem = new CartItem(user, product, 2);
        cartItem.setId(1L);

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(cartItemRepository.findByUser(user)).thenReturn(List.of(cartItem));

        CartResponse response = cartService.getCart("john@example.com");

        assertNotNull(response);
        assertNotNull(response.getCartItems());
        assertEquals(1, response.getCartItems().size());
        assertEquals(1L, response.getCartItems().get(0).getProductId());
        assertEquals(2, response.getCartItems().get(0).getQuantity());
        assertEquals("Classic Spring", response.getCartItems().get(0).getProduct().getName());
    }

    @Test
    void getCart_UserNotFound_ThrowsResourceNotFoundException() {
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> cartService.getCart("ghost@example.com"));
    }

    // --- updateCart tests ---

    @Test
    void updateCart_NewItem_CreatesNewCartItem() {
        User user = createTestUser();
        Product product = createTestProduct();

        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(3);

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByUserAndProduct(user, product)).thenReturn(Optional.empty());

        // After save, getCart is called internally — mock it
        CartItem savedItem = new CartItem(user, product, 3);
        savedItem.setId(1L);
        when(cartItemRepository.findByUser(user)).thenReturn(List.of(savedItem));

        CartResponse response = cartService.updateCart("john@example.com", request);

        verify(cartItemRepository).save(any(CartItem.class));
        assertNotNull(response);
        assertEquals(1, response.getCartItems().size());
        assertEquals(3, response.getCartItems().get(0).getQuantity());
    }

    @Test
    void updateCart_ExistingItem_UpdatesQuantity() {
        User user = createTestUser();
        Product product = createTestProduct();
        CartItem existingItem = new CartItem(user, product, 2);
        existingItem.setId(1L);

        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(5);

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByUserAndProduct(user, product)).thenReturn(Optional.of(existingItem));

        // After save, getCart is called internally
        CartItem updatedItem = new CartItem(user, product, 5);
        updatedItem.setId(1L);
        when(cartItemRepository.findByUser(user)).thenReturn(List.of(updatedItem));

        CartResponse response = cartService.updateCart("john@example.com", request);

        verify(cartItemRepository).save(existingItem);
        assertEquals(5, existingItem.getQuantity());
        assertNotNull(response);
        assertEquals(1, response.getCartItems().size());
    }

    @Test
    void updateCart_RemoveItem_WhenQuantityIsZeroOrLess() {
        User user = createTestUser();
        Product product = createTestProduct();
        CartItem existingItem = new CartItem(user, product, 2);
        existingItem.setId(1L);

        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(0);

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByUserAndProduct(user, product)).thenReturn(Optional.of(existingItem));

        // After deletion, getCart returns empty
        when(cartItemRepository.findByUser(user)).thenReturn(Collections.emptyList());

        CartResponse response = cartService.updateCart("john@example.com", request);

        verify(cartItemRepository).delete(existingItem);
        verify(cartItemRepository, never()).save(any(CartItem.class));
        assertNotNull(response);
        assertTrue(response.getCartItems().isEmpty());
    }
}
