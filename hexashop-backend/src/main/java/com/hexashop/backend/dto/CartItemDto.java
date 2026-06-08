package com.hexashop.backend.dto;

import com.hexashop.backend.model.CartItem;

public class CartItemDto {

    private Long productId;
    private Integer quantity;
    private ProductInfo product;

    public static class ProductInfo {
        private Long id;
        private String name;
        private Double price;
        private String image;

        public ProductInfo() {
        }

        public ProductInfo(Long id, String name, Double price, String image) {
            this.id = id;
            this.name = name;
            this.price = price;
            this.image = image;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }
    }

    public CartItemDto() {
    }

    public CartItemDto(Long productId, Integer quantity, ProductInfo product) {
        this.productId = productId;
        this.quantity = quantity;
        this.product = product;
    }

    public static CartItemDto fromCartItem(CartItem item) {
        ProductInfo productInfo = new ProductInfo(
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getPrice(),
                item.getProduct().getImage()
        );
        return new CartItemDto(item.getProduct().getId(), item.getQuantity(), productInfo);
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public ProductInfo getProduct() {
        return product;
    }

    public void setProduct(ProductInfo product) {
        this.product = product;
    }
}
