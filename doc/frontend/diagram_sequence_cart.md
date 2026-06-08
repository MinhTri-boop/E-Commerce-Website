# Cart Lifecycle Sequence Diagram

This sequence diagram explains the complex cart logic, specifically focusing on the requirement that only authenticated users can buy, and how the cart synchronizes on login.

```mermaid
sequenceDiagram
    actor User
    participant Card as ProductCard
    participant Modal as LoginModal
    participant Auth as AuthContext
    participant Cart as CartContext
    participant Server as Backend API

    Note over User, Cart: 1. Prevent Guest Purchase
    User->>Card: Clicks "Add to Cart"
    Card->>Auth: requireAuth(callback)
    Auth->>Auth: Check isAuthenticated
    alt is false
        Auth->>Modal: setLoginModalOpen(true)
        Modal-->>User: Show Login Prompt
    end
    
    Note over User, Server: 2. Login & Sync Logic
    User->>Modal: Logs In
    Modal->>Auth: login()
    Auth->>Server: POST /auth/login
    Server-->>Auth: Success (Token)
    Auth->>Cart: Triggers useEffect (isAuthenticated = true)
    
    Cart->>Server: GET /api/cart (Fetch remote cart)
    Server-->>Cart: Return existing server cart
    Cart-->>User: Update Cart UI
    
    Note over User, Server: 3. Authenticated Purchase
    User->>Card: Clicks "Add to Cart" (Again)
    Card->>Auth: requireAuth(callback)
    Auth->>Cart: callback() -> addToCart(product, quantity)
    Cart->>Server: POST /api/cart { productId, quantity }
    Server-->>Cart: 200 OK (Updated CartItems)
    Cart-->>User: Show Success Alert & Update UI
```
