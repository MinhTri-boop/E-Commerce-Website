# Project: HexaShop Backend

## Architecture
- **Tech Stack**: Java 21, Spring Boot 3.x, Spring Data JPA, PostgreSQL.
- **Security**: Spring Security + JWT.
- **Deployment Context**: Architected for Azure Cloud (env variables, application.yml, CORS).

## Code Layout
- `src/main/java/com/hexashop/backend`: Base package
- `src/main/java/com/hexashop/backend/config`: Configuration (Security, CORS, Global Exception Handler)
- `src/main/java/com/hexashop/backend/controller`: REST Controllers
- `src/main/java/com/hexashop/backend/service`: Business Logic
- `src/main/java/com/hexashop/backend/repository`: JPA Repositories
- `src/main/java/com/hexashop/backend/model`: Entities & DTOs
- `src/main/resources/application.yml`: Configuration properties

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Project Setup & Foundation | Spring Boot initialization, Postgres setup, standard error handling config. | none | PLANNED |
| M1 | Authentication API | `/api/auth/register`, `/api/auth/login`, `/api/auth/me` with JWT. | M0 | PLANNED |
| M2 | Product API | `/api/products` (search, filter, pagination), `/api/products/:id`. | M0 | PLANNED |
| M3 | Cart API | `/api/cart` GET, POST/PUT to retrieve/update cart items. | M1, M2 | PLANNED |
| M4 | Final Milestone | Pass 100% E2E Test Suite (Tiers 1-4). | M1, M2, M3 | PLANNED |

## Interface Contracts
### Global Error Format
All errors must return:
```json
{
  "error": true,
  "message": "User-friendly message",
  "details": "Technical details or field errors"
}
```
