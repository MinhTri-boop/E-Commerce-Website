# Sơ đồ Kiến trúc Hệ thống (Backend Architecture)

Sơ đồ dưới đây mô tả luồng dữ liệu từ người dùng (Internet) đi qua hạ tầng Azure vào tới Spring Boot Backend.

```mermaid
flowchart TD
    User([Người dùng / Trình duyệt]) -- "HTTPS (443)" --> BS[Azure Blob Storage\n(Static Website - React)]
    User -- "HTTPS (443)" --> PubVM[Public VM - Bastion Host\n(Nginx Reverse Proxy)]
    
    subgraph Azure Virtual Network (VNet)
        subgraph Public Subnet
            PubVM
        end
        
        subgraph Private Subnet
            PrivVM[Private VM\n(Core Backend)]
            
            subgraph Spring Boot App
                SC[Security Filter Chain\n(JWT Auth)]
                Ctrl[Controllers]
                Svc[Services]
                Repo[JPA Repositories]
            end
            
            DB[(PostgreSQL\nDatabase)]
        end
    end
    
    PubVM -- "HTTP (8080)\nProxy Pass" --> SC
    SC -- "Xác thực hợp lệ" --> Ctrl
    Ctrl --> Svc
    Svc --> Repo
    Repo -- "JDBC/SQL (5432)" --> DB
    
    %% Styling
    classDef azure fill:#0072C6,stroke:#fff,stroke-width:2px,color:#fff;
    classDef spring fill:#6DB33F,stroke:#fff,stroke-width:2px,color:#fff;
    classDef db fill:#336791,stroke:#fff,stroke-width:2px,color:#fff;
    
    class BS,PubVM,PrivVM azure;
    class SC,Ctrl,Svc,Repo spring;
    class DB db;
```

### Chú thích:
1. **Azure Blob Storage**: Nơi lưu trữ mã nguồn tĩnh của Frontend (ReactJS).
2. **Public VM**: Đóng vai trò là cửa ngõ giao tiếp duy nhất với Internet. Nginx tiếp nhận HTTPS, giải mã SSL và đẩy request về Private VM qua mạng nội bộ.
3. **Private VM**: Không kết nối trực tiếp với Internet. Chạy ứng dụng Spring Boot và PostgreSQL.
4. **Spring Boot App**: Luồng xử lý nội bộ đi từ màng lọc bảo mật (JWT) -> Controller -> Service -> Repository -> Database.
