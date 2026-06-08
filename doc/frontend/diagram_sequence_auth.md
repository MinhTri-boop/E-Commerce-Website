# Authentication Sequence Diagram

This diagram demonstrates the sequence of events when a user attempts to log in, including how tokens are stored and how Axios interceptors handle subsequent requests.

```mermaid
sequenceDiagram
    actor User
    participant UI as UserMenu / LoginModal
    participant Auth as AuthContext
    participant Storage as LocalStorage
    participant API as AxiosClient
    participant Server as Spring Boot Backend

    User->>UI: Enters Email & Password
    UI->>Auth: login(email, password)
    Auth->>API: POST /api/auth/login
    
    API->>Server: Forward Request
    alt Invalid Credentials
        Server-->>API: 401 Unauthorized
        API-->>Auth: Error Response
        Auth-->>UI: Set Error State
        UI-->>User: Show Error Message
    else Valid Credentials
        Server-->>API: 200 OK { user, token }
        API-->>Auth: Success Response
        Auth->>Storage: Save JWT Token
        Auth->>Storage: Save User Info
        Auth-->>UI: Update State (isAuthenticated = true)
        UI-->>User: Close Modal, Update Header
    end
    
    Note over API, Server: Subsequent Requests
    Auth->>API: Request with AxiosClient
    API->>Storage: Get JWT Token
    API->>Server: HTTP Request + Authorization: Bearer <token>
```
