# Product Browsing & Filtering Sequence Diagram

This diagram shows how user interactions with the product filter trigger state changes in the `SearchContext`, which in turn fetches new paginated data from the backend.

```mermaid
sequenceDiagram
    actor User
    participant ProductsPage as ProductsPage (UI)
    participant Filter as ProductFilter
    participant Ctx as SearchContext
    participant API as AxiosClient
    participant Server as Spring Boot Backend

    Note over Ctx: Component Mounts
    Ctx->>API: GET /api/products (page=1, limit=9)
    API->>Server: Fetch Data
    Server-->>API: 200 OK (Products + PaginationInfo)
    API-->>Ctx: Update filteredProducts & totalPages
    Ctx-->>ProductsPage: Render ProductGrid
    
    User->>Filter: Changes Category to "Men"
    Filter->>Ctx: setSelectedCategory("men")
    
    User->>Filter: Changes Price Slider to max $200
    Filter->>Ctx: setPriceRange({max: 200})
    
    Note over Ctx: useEffect triggers on state change
    Ctx->>API: GET /api/products?category=men&maxPrice=200&page=1
    API->>Server: Fetch Data
    Server-->>API: 200 OK
    API-->>Ctx: Update filteredProducts
    Ctx-->>ProductsPage: Re-render UI with new products
    
    User->>ProductsPage: Clicks Page 2
    ProductsPage->>Ctx: setCurrentPage(2)
    Ctx->>API: GET /api/products?category=men&maxPrice=200&page=2
    API->>Server: Fetch Data
    Server-->>Ctx: Return Page 2
    Ctx-->>ProductsPage: Render Page 2
```
