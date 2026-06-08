package com.hexashop.backend.service;

import com.hexashop.backend.dto.PaginationInfo;
import com.hexashop.backend.dto.ProductListResponse;
import com.hexashop.backend.exception.ResourceNotFoundException;
import com.hexashop.backend.model.Product;
import com.hexashop.backend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductListResponse getProducts(String search, String category,
                                           Double minPrice, Double maxPrice,
                                           String sortBy, int page, int limit) {

        Specification<Product> spec = Specification
                .where(ProductSpecification.hasCategory(category))
                .and(ProductSpecification.hasNameLike(search))
                .and(ProductSpecification.hasPriceGreaterThanOrEqual(minPrice))
                .and(ProductSpecification.hasPriceLessThanOrEqual(maxPrice));

        Sort sort = resolveSort(sortBy);

        // Frontend sends 1-based page numbers; Spring Data uses 0-based
        Pageable pageable = PageRequest.of(page - 1, limit, sort);

        Page<Product> productPage = productRepository.findAll(spec, pageable);

        PaginationInfo pagination = new PaginationInfo(
                page,
                productPage.getTotalPages(),
                productPage.getTotalElements()
        );

        return new ProductListResponse(productPage.getContent(), pagination);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null) {
            return Sort.by("id").ascending();
        }
        return switch (sortBy) {
            case "price-asc" -> Sort.by("price").ascending();
            case "price-desc" -> Sort.by("price").descending();
            case "name-asc" -> Sort.by("name").ascending();
            case "name-desc" -> Sort.by("name").descending();
            case "rating-desc" -> Sort.by("rating").descending();
            default -> Sort.by("id").ascending();
        };
    }
}
