package com.hexashop.backend.service;

import com.hexashop.backend.dto.ProductListResponse;
import com.hexashop.backend.exception.ResourceNotFoundException;
import com.hexashop.backend.model.Product;
import com.hexashop.backend.repository.ProductRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;

    @Test
    @SuppressWarnings("unchecked")
    void getProducts_ReturnsPagedResults() {
        Product product1 = new Product()
                .name("Classic Spring")
                .price(120.0)
                .category("men");
        product1.setId(1L);

        Product product2 = new Product()
                .name("Air Force 1 X")
                .price(90.0)
                .category("men");
        product2.setId(2L);

        List<Product> products = List.of(product1, product2);
        Page<Product> productPage = new PageImpl<>(products);

        when(productRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(productPage);

        ProductListResponse response = productService.getProducts(
                null, null, null, null, null, 1, 9);

        assertNotNull(response);
        assertNotNull(response.getProducts());
        assertEquals(2, response.getProducts().size());
        assertEquals("Classic Spring", response.getProducts().get(0).getName());
        assertEquals("Air Force 1 X", response.getProducts().get(1).getName());
        assertNotNull(response.getPagination());
        assertEquals(1, response.getPagination().getCurrentPage());
        assertEquals(2, response.getPagination().getTotalItems());
    }

    @Test
    void getProductById_Success() {
        Product product = new Product()
                .name("Classic Spring")
                .price(120.0)
                .category("men");
        product.setId(1L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Product result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Classic Spring", result.getName());
        assertEquals(120.0, result.getPrice());
    }

    @Test
    void getProductById_NotFound_ThrowsResourceNotFoundException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> productService.getProductById(999L));

        assertEquals("Product not found with id: 999", exception.getMessage());
    }
}
