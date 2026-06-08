# Hexashop Entity Relationship Diagram (ERD)

Dưới đây là sơ đồ cấu trúc Cơ sở dữ liệu (Database Schema) của dự án Hexashop dựa trên các Entity JPA hiện tại.

```mermaid
erDiagram
    users {
        BIGINT id PK
        VARCHAR name
        VARCHAR email UK "Unique"
        VARCHAR password
        TIMESTAMP created_at
    }

    products {
        BIGINT id PK
        VARCHAR name
        DOUBLE price
        VARCHAR category
        VARCHAR image
        INTEGER rating
        VARCHAR description
        VARCHAR quote
        BOOLEAN in_stock
    }

    product_images {
        BIGINT product_id FK "References products(id)"
        VARCHAR image_url
    }

    cart_items {
        BIGINT id PK
        BIGINT user_id FK "References users(id)"
        BIGINT product_id FK "References products(id)"
        INTEGER quantity
    }

    %% Relationships
    users ||--o{ cart_items : "1 User có nhiều CartItem"
    products ||--o{ cart_items : "1 Product có mặt trong nhiều CartItem"
    products ||--o{ product_images : "1 Product có nhiều ảnh phụ"
```

### Chú thích chi tiết:
1. **Bảng `users` (Người dùng):**
   - Lưu thông tin cơ bản và thông tin đăng nhập. 
   - `email` được thiết lập `Unique` (Không được trùng lặp) để dùng làm tài khoản đăng nhập.

2. **Bảng `products` (Sản phẩm):**
   - Lưu trữ giá cả, danh mục (`category`), ảnh chính (`image`) và thông tin mô tả chi tiết của sản phẩm.

3. **Bảng `product_images` (Ảnh phụ của sản phẩm):**
   - Do một sản phẩm có thể có một mảng nhiều ảnh (List of images), Hibernate tự động tạo bảng phụ này nhờ annotation `@ElementCollection`. Bảng này liên kết với `products` thông qua `product_id`.

4. **Bảng `cart_items` (Giỏ hàng):**
   - Bảng trung gian kết nối giữa `users` và `products`.
   - Có một ràng buộc `UniqueConstraint(user_id, product_id)`: Đảm bảo rằng một người dùng không thể có 2 dòng của cùng 1 sản phẩm trong giỏ hàng (nếu mua thêm thì chỉ tăng `quantity` lên chứ không tạo dòng mới).
