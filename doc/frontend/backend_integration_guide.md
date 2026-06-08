# Backend Integration Guide & Frontend Architecture

This document serves as the primary reference for backend developers working on the HexaShop E-commerce project. It details the current state of the React frontend, the data structures expected by the frontend, and the REST APIs that need to be implemented to replace the existing mock systems.

## 1. Frontend Architecture Overview

The frontend is built as a Single Page Application (SPA) using **React** and **Vite**.

### Core Technologies
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **State Management**: React Context API (`AuthContext`, `CartContext`, `SearchContext`)
- **Styling**: Vanilla CSS (CSS Grid / Flexbox - No Bootstrap)
- **Icons**: `react-icons`

### File Structure
```
src/
├── components/       # Reusable UI components (buttons, modals, headers)
│   ├── auth/         # LoginModal, RegisterModal, UserMenu
│   ├── cart/         # CartDrawer, CartItem, CartIcon
│   ├── home/         # Banners, Carousels, etc.
│   ├── layout/       # Header, Footer, Preloader
│   └── product/      # ProductCard, ProductGrid, ProductFilter, SearchBar
├── context/          # React Contexts for Global State
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── SearchContext.jsx
├── data/             # Mock data (To be replaced by Backend APIs)
│   └── products.js
├── pages/            # Main route components
│   ├── HomePage.jsx
│   ├── AboutPage.jsx
│   ├── ProductsPage.jsx
│   ├── SingleProductPage.jsx
│   └── ContactPage.jsx
├── App.jsx           # Main layout and route definitions
├── index.css         # Global stylesheet
└── main.jsx          # Entry point
```

---

## 2. Global State & Current Mock Implementations

Currently, the frontend uses `localStorage` and static JavaScript arrays to simulate a backend. **Your primary goal is to build APIs so the frontend team can remove these mocks.**

1. **Authentication (`AuthContext.jsx`)**
   - **Current**: Saves a list of users to `localStorage` under `hexashop_users` and tracks login status via `hexashop_current_user`.
   - **Future**: Needs standard JWT-based or Session-based authentication.

2. **Shopping Cart (`CartContext.jsx`)**
   - **Current**: Cart items are saved to `localStorage` under `hexashop_cart` so they persist across page reloads.
   - **Future**: Cart state should be synced with the database for logged-in users, but can remain in `localStorage` for guest users.

3. **Products & Search (`SearchContext.jsx` & `products.js`)**
   - **Current**: Loads a static array of products. Search, filtering (category, price), and sorting are done client-side in `SearchContext.jsx`.
   - **Future**: The frontend will send query parameters to the backend, and the database will handle filtering, sorting, and pagination.

---

## 3. Required API Contracts

Below are the exact API endpoints and JSON payloads the frontend will expect. By adhering to these contracts, you ensure zero conflicts during integration.

### A. Authentication APIs

**1. Register User**
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully",
    "user": { "id": 1, "name": "John Doe", "email": "john@example.com" },
    "token": "jwt_token_here" 
  }
  ```

**2. Login User**
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK)**: Same as Register response. Return a 401 for invalid credentials.

**3. Get Current User (To restore session on refresh)**
- **Endpoint**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  { "id": 1, "name": "John Doe", "email": "john@example.com" }
  ```

### B. Product APIs

**1. Get Products List (With Filters, Sort, Pagination)**
- **Endpoint**: `GET /api/products`
- **Query Parameters Expected from Frontend**:
  - `search`: String (e.g., "leather")
  - `category`: String ("men", "women", "kids", "accessories")
  - `minPrice`: Number
  - `maxPrice`: Number
  - `sortBy`: String ("price-asc", "price-desc", "name-asc", "name-desc", "rating-desc")
  - `page`: Number
  - `limit`: Number (Default: 9)
- **Response (200 OK)**:
  ```json
  {
    "products": [
      {
        "id": 1,
        "name": "Classic Leather Bag",
        "price": 120.00,
        "category": "accessories",
        "image": "/images/product-01.jpg",
        "rating": 5
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 45
    }
  }
  ```

**2. Get Single Product Details**
- **Endpoint**: `GET /api/products/:id`
- **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "name": "Classic Leather Bag",
    "price": 120.00,
    "category": "accessories",
    "image": "/images/product-01.jpg",
    "images": ["/images/product-01.jpg", "/images/product-01-alt.jpg"],
    "rating": 5,
    "description": "High quality leather...",
    "quote": "A must-have for everyday use.",
    "inStock": true
  }
  ```

### C. Cart & Checkout APIs (For Logged-in Users)

*Note: Guest carts are handled via LocalStorage. These APIs apply when a user logs in.*

**1. Sync/Get Cart**
- **Endpoint**: `GET /api/cart`
- **Response (200 OK)**:
  ```json
  {
    "cartItems": [
      {
        "productId": 1,
        "quantity": 2,
        "product": { "name": "Classic Leather Bag", "price": 120.00, "image": "..." }
      }
    ]
  }
  ```

**2. Update Cart Item**
- **Endpoint**: `POST /api/cart` (or PUT)
- **Request Body**:
  ```json
  { "productId": 1, "quantity": 2 }
  ```

---

## 4. Environment & Collaboration Guidelines

### CORS Configuration
Since the frontend development server runs on `http://localhost:5173`, the backend MUST have CORS configured to accept requests from this origin during development.

### Environment Variables
Frontend API calls will be prefixed using a base URL defined in `.env`.
```env
# Frontend .env
VITE_API_BASE_URL=http://localhost:8080/api
```
Backend should ideally run on a different port (e.g., 8080, 3000) locally.

### Handling Image Assets
Currently, product images are stored locally in the frontend `public/images/` folder. 
- In Phase 1, the backend database can simply store the relative string paths (e.g., `"/images/men-01.jpg"`).
- In Phase 2, when an admin panel is built, the backend should host the images (e.g., via AWS S3 or a public static folder) and return full URLs (`https://api.yourdomain.com/uploads/men-01.jpg`).

### Error Handling Standard
For a smooth frontend experience, the backend should return errors in a predictable format:
```json
{
  "error": true,
  "message": "Invalid email or password",
  "details": "..." // Optional field for validation errors
}
```
The frontend `AuthContext` is already designed to capture `message` and display it in the UI.
