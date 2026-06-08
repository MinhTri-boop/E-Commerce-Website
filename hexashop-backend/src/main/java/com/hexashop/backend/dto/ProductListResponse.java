package com.hexashop.backend.dto;

import com.hexashop.backend.model.Product;

import java.util.List;

public class ProductListResponse {

    private List<Product> products;
    private PaginationInfo pagination;

    public ProductListResponse() {
    }

    public ProductListResponse(List<Product> products, PaginationInfo pagination) {
        this.products = products;
        this.pagination = pagination;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public PaginationInfo getPagination() {
        return pagination;
    }

    public void setPagination(PaginationInfo pagination) {
        this.pagination = pagination;
    }
}
