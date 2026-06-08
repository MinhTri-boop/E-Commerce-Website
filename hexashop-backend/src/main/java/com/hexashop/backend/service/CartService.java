package com.hexashop.backend.service;

import com.hexashop.backend.dto.CartItemDto;
import com.hexashop.backend.dto.CartItemRequest;
import com.hexashop.backend.dto.CartResponse;
import com.hexashop.backend.exception.ResourceNotFoundException;
import com.hexashop.backend.model.CartItem;
import com.hexashop.backend.model.Product;
import com.hexashop.backend.model.User;
import com.hexashop.backend.repository.CartItemRepository;
import com.hexashop.backend.repository.ProductRepository;
import com.hexashop.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository,
                       UserRepository userRepository,
                       ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public CartResponse getCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        List<CartItemDto> cartItemDtos = cartItems.stream()
                .map(CartItemDto::fromCartItem)
                .toList();

        return new CartResponse(cartItemDtos);
    }

    @Transactional
    public CartResponse updateCart(String email, CartItemRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (request.getQuantity() <= 0) {
            Optional<CartItem> existingItem = cartItemRepository.findByUserAndProduct(user, product);
            existingItem.ifPresent(cartItemRepository::delete);
        } else {
            Optional<CartItem> existingItem = cartItemRepository.findByUserAndProduct(user, product);

            if (existingItem.isPresent()) {
                CartItem cartItem = existingItem.get();
                cartItem.setQuantity(request.getQuantity());
                cartItemRepository.save(cartItem);
            } else {
                CartItem cartItem = new CartItem(user, product, request.getQuantity());
                cartItemRepository.save(cartItem);
            }
        }

        return getCart(email);
    }
}
