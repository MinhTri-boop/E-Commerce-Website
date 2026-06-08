package com.hexashop.backend.dto;

import java.util.List;

public class CartResponse {

    private List<CartItemDto> cartItems;

    public CartResponse() {
    }

    public CartResponse(List<CartItemDto> cartItems) {
        this.cartItems = cartItems;
    }

    public List<CartItemDto> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItemDto> cartItems) {
        this.cartItems = cartItems;
    }
}
