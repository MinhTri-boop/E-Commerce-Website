# Global State Management (Context API)

This class diagram represents the React Context API providers, their exposed state variables, and functions. It shows how the global state connects to the Backend APIs (via Axios).

```mermaid
classDiagram
    class AuthContext {
        +Object user
        +Boolean isAuthenticated
        +Boolean isLoginModalOpen
        +Boolean isRegisterModalOpen
        +requireAuth(callback)
        +login(email, password)
        +register(name, email, password)
        +logout()
    }
    
    class CartContext {
        +Array cartItems
        +Number cartCount
        +Number cartTotal
        +Boolean isCartOpen
        +addToCart(product, quantity)
        +removeFromCart(productId)
        +updateQuantity(productId, quantity)
        +clearCart()
        +toggleCart()
    }
    
    class SearchContext {
        +String searchQuery
        +String selectedCategory
        +Object priceRange
        +String sortBy
        +Array filteredProducts
        +Number currentPage
        +Number totalPages
        +setSearchQuery()
        +setSelectedCategory()
    }

    class AxiosClient {
        +baseURL: String
        +interceptors: Token Injection & 401 Catch
    }

    AuthContext --> AxiosClient : /api/auth
    CartContext --> AxiosClient : /api/cart
    SearchContext --> AxiosClient : /api/products
    AuthContext ..> LocalStorage : JWT Token
```
