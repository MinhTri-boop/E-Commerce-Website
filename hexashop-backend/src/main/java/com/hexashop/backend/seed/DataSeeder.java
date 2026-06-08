package com.hexashop.backend.seed;

import com.hexashop.backend.model.Product;
import com.hexashop.backend.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private static final String DEFAULT_DESCRIPTION =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod kon tempor incididunt ut labore.";
    private static final String DEFAULT_QUOTE =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiuski smod.";

    private final ProductRepository productRepository;

    public DataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            log.info("Products table already populated — skipping seed");
            return;
        }

        List<Product> products = List.of(
                new Product()
                        .name("Classic Spring")
                        .price(120.0)
                        .category("men")
                        .image("/images/men-01.jpg")
                        .images(List.of("/images/men-01.jpg", "/images/single-product-01.jpg"))
                        .rating(5)
                        .description(DEFAULT_DESCRIPTION)
                        .quote(DEFAULT_QUOTE)
                        .inStock(true),

                new Product()
                        .name("Air Force 1 X")
                        .price(90.0)
                        .category("men")
                        .image("/images/men-02.jpg")
                        .images(List.of("/images/men-02.jpg", "/images/single-product-02.jpg"))
                        .rating(5)
                        .description(DEFAULT_DESCRIPTION)
                        .quote(DEFAULT_QUOTE)
                        .inStock(true),

                new Product()
                        .name("Love Nana '20")
                        .price(150.0)
                        .category("men")
                        .image("/images/men-03.jpg")
                        .images(List.of("/images/men-03.jpg", "/images/single-product-01.jpg"))
                        .rating(4)
                        .description(DEFAULT_DESCRIPTION)
                        .quote(DEFAULT_QUOTE)
                        .inStock(true),

                new Product()
                        .name("New Green Jacket")
                        .price(75.0)
                        .category("women")
                        .image("/images/women-01.jpg")
                        .images(List.of("/images/women-01.jpg", "/images/single-product-01.jpg"))
                        .rating(5)
                        .description(DEFAULT_DESCRIPTION)
                        .quote(DEFAULT_QUOTE)
                        .inStock(true),

                new Product()
                        .name("Classic Dress")
                        .price(45.0)
                        .category("women")
                        .image("/images/women-02.jpg")
                        .images(List.of("/images/women-02.jpg", "/images/single-product-02.jpg"))
                        .rating(5)
                        .description(DEFAULT_DESCRIPTION)
                        .quote(DEFAULT_QUOTE)
                        .inStock(true),

                new Product()
                        .name("Spring Collection")
                        .price(130.0)
                        .category("women")
                        .image("/images/women-03.jpg")
                        .images(List.of("/images/women-03.jpg", "/images/single-product-01.jpg"))
                        .rating(4)
                        .description(DEFAULT_DESCRIPTION)
                        .quote(DEFAULT_QUOTE)
                        .inStock(true),

                new Product()
                        .name("School Collection")
                        .price(80.0)
                        .category("kids")
                        .image("/images/kid-01.jpg")
                        .images(List.of("/images/kid-01.jpg", "/images/single-product-01.jpg"))
                        .rating(5)
                        .description(DEFAULT_DESCRIPTION)
                        .quote(DEFAULT_QUOTE)
                        .inStock(true),

                new Product()
                        .name("Summer Cap")
                        .price(12.0)
                        .category("kids")
                        .image("/images/kid-02.jpg")
                        .images(List.of("/images/kid-02.jpg", "/images/single-product-02.jpg"))
                        .rating(4)
                        .description(DEFAULT_DESCRIPTION)
                        .quote(DEFAULT_QUOTE)
                        .inStock(true),

                new Product()
                        .name("Classic Kid")
                        .price(30.0)
                        .category("kids")
                        .image("/images/kid-03.jpg")
                        .images(List.of("/images/kid-03.jpg", "/images/single-product-01.jpg"))
                        .rating(5)
                        .description(DEFAULT_DESCRIPTION)
                        .quote(DEFAULT_QUOTE)
                        .inStock(true),

                new Product()
                        .name("Leather Handbag")
                        .price(210.0)
                        .category("accessories")
                        .image("/images/explore-image-01.jpg")
                        .images(List.of("/images/explore-image-01.jpg", "/images/explore-image-02.jpg"))
                        .rating(5)
                        .description("Premium leather handbag crafted with the finest materials. Perfect for everyday use.")
                        .quote("Quality is remembered long after the price is forgotten.")
                        .inStock(true),

                new Product()
                        .name("Designer Sunglasses")
                        .price(65.0)
                        .category("accessories")
                        .image("/images/baner-right-image-04.jpg")
                        .images(List.of("/images/baner-right-image-04.jpg", "/images/explore-image-01.jpg"))
                        .rating(4)
                        .description("Stylish designer sunglasses with UV protection. A must-have for sunny days.")
                        .quote("Fashion is about dressing according to what's fashionable.")
                        .inStock(true),

                new Product()
                        .name("Vintage Watch")
                        .price(320.0)
                        .category("accessories")
                        .image("/images/baner-right-image-03.jpg")
                        .images(List.of("/images/baner-right-image-03.jpg", "/images/single-product-02.jpg"))
                        .rating(5)
                        .description("Elegant vintage watch with leather strap. Timeless design for the modern gentleman.")
                        .quote("A watch is a piece of art that tells time.")
                        .inStock(false)
        );

        productRepository.saveAll(products);
        log.info("Seeded 12 products");
    }
}
