# 🏛️ Kiến trúc Tổng quan Dự án E-Commerce (Overall Architecture)

Tài liệu này thể hiện cái nhìn toàn cảnh về hệ thống E-Commerce Web, bao gồm Frontend, Backend và mô hình triển khai trên nền tảng **Microsoft Azure Cloud**.

---

## 1. 🌐 Sơ đồ Triển khai Cơ sở hạ tầng (Infrastructure Architecture)

Sơ đồ dưới đây mô tả cách các thành phần hệ thống được phân bổ trên hạ tầng đám mây, tập trung vào tính bảo mật, hiệu năng và khả năng mở rộng.

```mermaid
flowchart TD
    %% Định nghĩa các Actor
    User(("👨‍💻 Khách hàng\n(Trình duyệt Web)"))
    Admin(("🛠️ Developer / Admin\n(Bảo trì hệ thống)"))

    %% Azure Infrastructure
    subgraph Azure ["☁️ Microsoft Azure Cloud"]
        direction TB
        
        subgraph StaticWeb ["🚀 Frontend Hosting (CDN / Storage)"]
            React["⚛️ ReactJS SPA\n(Azure Blob Storage)"]
        end
        
        subgraph VNet ["🔒 Azure Virtual Network (VNet)"]
            direction TB
            subgraph PubSub ["🌐 Public Subnet (DMZ)"]
                Nginx["🛡️ Public VM - Nginx\nReverse Proxy / Bastion Host\n(Ports: 80, 443, 22)"]
            end
            
            subgraph PrivSub ["🔏 Private Subnet (Nội bộ)"]
                direction LR
                API["⚙️ Private VM - Spring Boot\nCore Backend API\n(Ports: 8080, 22)"]
                DB[("🗄️ PostgreSQL\nDatabase\n(Port: 5432)")]
            end
        end
    end

    %% Luồng giao tiếp
    User == "1. Tải UI Web (HTTPS)" ===> React
    User == "2. Gọi API (HTTPS)" ===> Nginx
    
    Nginx -. "3. Proxy Pass (HTTP Nội bộ)" .-> API
    API -. "4. Đọc/Ghi dữ liệu" .-> DB
    
    Admin -- "SSH (Bastion Host)" ---> Nginx
    Nginx -- "SSH Tunnel" ---> API
    Nginx -- "SSH Tunnel" ---> DB

    %% Cấu hình Style
    classDef actor fill:#f9f9f9,stroke:#333,stroke-width:2px,color:#333;
    classDef frontend fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000,rx:10,ry:10;
    classDef backend fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#000,rx:10,ry:10;
    classDef database fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#000,rx:10,ry:10;
    classDef proxy fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000,rx:10,ry:10;
    classDef cloud fill:#fafafa,stroke:#9e9e9e,stroke-width:2px,stroke-dasharray: 5 5;
    classDef subnet fill:#ffffff,stroke:#bdbdbd,stroke-width:1px,rx:5,ry:5;

    class User,Admin actor;
    class React frontend;
    class API backend;
    class DB database;
    class Nginx proxy;
    class Azure cloud;
    class VNet,StaticWeb,PubSub,PrivSub subnet;
```

---

## 2. 🔄 Luồng Dữ liệu Chi tiết (Detailed Data Flow Diagram)

Sơ đồ này đi sâu vào cách thức các request từ người dùng được xử lý qua từng lớp của ứng dụng theo trình tự thời gian.

```mermaid
sequenceDiagram
    autonumber
    actor U as 👨‍💻 Khách hàng
    participant F as ⚛️ ReactJS SPA
    participant N as 🛡️ Nginx (Proxy)
    participant B as ⚙️ Spring Boot API
    participant D as 🗄️ PostgreSQL DB

    Note over U,F: 🚀 Giai đoạn 1: Tải giao diện
    U->>F: Truy cập Website (GET /)
    F-->>U: Trả về HTML/CSS/JS (Static files)
    
    Note over U,D: ⚡ Giai đoạn 2: Tương tác dữ liệu
    U->>F: Tương tác trên UI (Click, Nhập form)
    F->>N: Gọi API bảo mật (HTTPS)
    
    N->>N: SSL Termination & Lọc Request
    N->>B: Proxy Pass (HTTP)
    
    B->>B: Xử lý Business Logic
    B->>D: Thực thi Query (SQL)
    D-->>B: Trả kết quả dữ liệu
    
    B-->>N: Phản hồi JSON
    N-->>F: Chuyển tiếp JSON an toàn
    F-->>U: Cập nhật UI (Re-render DOM)
```

---

## 3. 🎯 Điểm nổi bật của Kiến trúc (Architecture Highlights)

Kiến trúc này mang lại các ưu điểm vượt trội cho hệ thống E-Commerce:

### 🌟 3.1. Phân tách Frontend & Backend (Decoupled Architecture)
- **Frontend** (ReactJS) được build thành các tệp tĩnh và lưu trữ trên **Azure Blob Storage / CDN**. 
- 📈 **Lợi ích**: Tối ưu hóa tốc độ tải trang nhờ phân phối qua CDN, giảm hoàn toàn tải tĩnh (static assets) cho máy chủ Backend, tiết kiệm chi phí hosting.

### 🛡️ 3.2. Bảo mật Đa lớp (Defense in Depth)
- **Không truy cập trực tiếp**: Người dùng bên ngoài chỉ được phép gọi vào `Nginx`. Backend API và Database bị "cách ly" hoàn toàn khỏi Internet.
- **Nginx Reverse Proxy**: Đặt tại *Public Subnet*, Nginx đóng vai trò là "người gác cổng", xử lý chứng chỉ SSL/TLS (HTTPS) và che giấu IP thực tế của các máy chủ nội bộ.
- **Private Subnet**: Database và API Server được khóa kín trong mạng nội bộ (*Private Network*), hạn chế tối đa các rủi ro từ những cuộc tấn công DDoS hay xâm nhập trực tiếp.

### 🔐 3.3. Quản trị An toàn qua Bastion Host
- Mọi thao tác bảo trì (Maintenance) từ Developer hoặc Admin đều phải đi qua **Nginx Server** bằng giao thức `SSH`.
- Server Nginx lúc này hoạt động như một **Bastion Host (Jump Box)**, tạo đường hầm kết nối an toàn (SSH Tunnel) để truy cập sâu vào các server nằm trong *Private Subnet*.
- 📉 **Lợi ích**: Giảm thiểu tối đa số lượng port mở ra ngoài Internet, tập trung giám sát và ghi log kiểm toán (audit) tại một điểm duy nhất.

---
> **💡 Mẹo nhỏ:** Để hiển thị sơ đồ tốt nhất, vui lòng xem tài liệu này trên các công cụ hỗ trợ Markdown Mermaid như VS Code (có cài extension), GitHub, hoặc Obsidian.
