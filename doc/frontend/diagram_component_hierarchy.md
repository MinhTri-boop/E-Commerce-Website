# Frontend Component Hierarchy Architecture

This diagram illustrates the component structure of the HexaShop React Application, detailing how React Router and Context Providers wrap the layout and individual pages.

```mermaid
graph TD
    %% Main Entry & Contexts
    Root[main.jsx] --> App[App.jsx]
    App --> AuthProvider[AuthContext.Provider]
    AuthProvider --> CartProvider[CartContext.Provider]
    CartProvider --> SearchProvider[SearchContext.Provider]
    
    %% Router & Layout
    SearchProvider --> Router[BrowserRouter]
    Router --> Layout[Layout Components]
    Router --> Routes{React Router Switch}
    
    %% Layout Components
    Layout --> Preloader[Preloader]
    Layout --> Header[Header]
    Layout --> Footer[Footer]
    
    Header --> UserMenu[UserMenu]
    UserMenu --> LoginModal[LoginModal]
    UserMenu --> RegisterModal[RegisterModal]
    Header --> CartIcon[CartIcon]
    CartIcon --> CartDrawer[CartDrawer]
    
    %% Pages
    Routes --> HomePage[HomePage]
    Routes --> AboutPage[AboutPage]
    Routes --> ProductsPage[ProductsPage]
    Routes --> SingleProductPage[SingleProductPage]
    Routes --> ContactPage[ContactPage]
    
    %% Page Components
    HomePage --> MainBanner[MainBanner]
    HomePage --> ProductCarousel[ProductCarousel]
    HomePage --> ExploreSection[ExploreSection]
    
    ProductsPage --> ProductFilter[ProductFilter]
    ProductsPage --> ProductGrid[ProductGrid]
    ProductsPage --> Pagination[Pagination]
    ProductGrid --> ProductCard[ProductCard]
    
    %% Styling
    classDef provider fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px;
    classDef page fill:#fce4ec,stroke:#e91e63,stroke-width:2px;
    classDef component fill:#f1f8e9,stroke:#8bc34a,stroke-width:1px;
    
    class AuthProvider,CartProvider,SearchProvider provider;
    class HomePage,AboutPage,ProductsPage,SingleProductPage,ContactPage page;
    class Header,Footer,ProductCard,ProductFilter,ProductGrid,LoginModal component;
```
