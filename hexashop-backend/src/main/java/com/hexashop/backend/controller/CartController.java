package com.hexashop.backend.controller;

import com.hexashop.backend.dto.CartItemRequest;
import com.hexashop.backend.dto.CartResponse;
import com.hexashop.backend.service.CartService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        CartResponse cart = cartService.getCart(userDetails.getUsername());
        return ResponseEntity.ok(cart);
    }

    @PostMapping
    public ResponseEntity<CartResponse> updateCart(@AuthenticationPrincipal UserDetails userDetails,
                                                   @Valid @RequestBody CartItemRequest request) {
        CartResponse cart = cartService.updateCart(userDetails.getUsername(), request);
        return ResponseEntity.ok(cart);
    }
}
