package com.hexashop.backend.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String category;

    private String image;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    private Integer rating;

    @Column(length = 1000)
    private String description;

    @Column(length = 500)
    private String quote;

    @Column(name = "in_stock")
    private Boolean inStock;

    public Product() {
    }

    public Product(Long id, String name, Double price, String category, String image,
                   List<String> images, Integer rating, String description, String quote,
                   Boolean inStock) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.image = image;
        this.images = images != null ? images : new ArrayList<>();
        this.rating = rating;
        this.description = description;
        this.quote = quote;
        this.inStock = inStock;
    }

    // Builder-style setters

    public Product id(Long id) {
        this.id = id;
        return this;
    }

    public Product name(String name) {
        this.name = name;
        return this;
    }

    public Product price(Double price) {
        this.price = price;
        return this;
    }

    public Product category(String category) {
        this.category = category;
        return this;
    }

    public Product image(String image) {
        this.image = image;
        return this;
    }

    public Product images(List<String> images) {
        this.images = images != null ? images : new ArrayList<>();
        return this;
    }

    public Product rating(Integer rating) {
        this.rating = rating;
        return this;
    }

    public Product description(String description) {
        this.description = description;
        return this;
    }

    public Product quote(String quote) {
        this.quote = quote;
        return this;
    }

    public Product inStock(Boolean inStock) {
        this.inStock = inStock;
        return this;
    }

    // Standard getters and setters

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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images != null ? images : new ArrayList<>();
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getQuote() {
        return quote;
    }

    public void setQuote(String quote) {
        this.quote = quote;
    }

    public Boolean getInStock() {
        return inStock;
    }

    public void setInStock(Boolean inStock) {
        this.inStock = inStock;
    }
}
