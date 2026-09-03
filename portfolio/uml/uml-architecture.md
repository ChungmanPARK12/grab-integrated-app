# Grab Integrated App — UML Architecture

## Overview

The UML architecture is organized into three levels, progressing from the overall system structure to detailed backend implementation.

- **Level 1 — System Architecture:** Mobile Client → Backend API → Database
- **Level 2 — Application Architecture:** Major backend packages and dependencies
- **Level 3 — Implementation Design:** Detailed modules, authentication, data models, middleware, and security logic

The current documentation focuses primarily on the backend architecture.

---

## Level 1 — System Architecture Overview

Level 1 shows the overall communication structure of the Grab Integrated App.

The architecture consists of three main components:

- **Mobile Client** — React Native / Expo
- **Backend API** — Node.js / Express
- **PostgreSQL Database** — Persistent application data

The Mobile Client communicates with the Backend API through HTTP-based REST APIs, while the Backend API accesses PostgreSQL through Prisma ORM.

Internal backend structures are intentionally excluded at this level and are expanded in Level 2 and Level 3.

### UML Diagram

- [View Level 1 — System Architecture](https://github.com/user-attachments/assets/e7dac884-0eb3-476c-ae12-f6bb8f76d038)

---

## Level 2 — Backend Application Architecture

Level 2 expands the Backend API from Level 1 and shows its major application components and dependency relationships.

The backend is organized into the following areas:

- **Routing** — Directs incoming requests to middleware and authentication flows.
- **Request Middleware** — Handles request-level processing and uses security utilities for token verification.
- **Authentication** — Handles authentication requests before passing application operations to the service layer.
- **Application Service** — Contains the main business logic and coordinates security, persistence, and logging operations.
- **Security Utilities** — Provides shared security-related functions used by middleware and application services.
- **Persistence** — Handles data access required by the application service.
- **Logging** — Records application events generated during service operations.

This level focuses on the separation of backend responsibilities and the dependency flow between major application components. Individual modules and implementation details are expanded in Level 3.

### UML Diagram

- [View Level 2 — Backend Application Architecture](https://github.com/user-attachments/assets/66c9d9ea-0489-406e-bef1-6f590f7d44b0)

---

## Level 3 — Backend Implementation Design

Level 3 expands the backend application architecture into implementation-level diagrams.

Each diagram focuses on a specific backend responsibility and shows the modules and dependencies used in the actual application structure.

---

### 01 — Backend Entry & Routing

This diagram describes how the backend application is initialized and connected to the API routing layer.

The entry flow consists of three main components:

- **Server** — Acts as the backend bootstrap and starts the application.
- **App** — Creates and configures the Express application through `createApp()`.
- **RoutesIndex** — Provides the root API router mounted by the application.

The initialization flow follows:

`Server → App → RoutesIndex`

The `App` mounts `RoutesIndex` under `/api`, establishing the root routing path for backend API requests.

More detailed request routing and authentication flows are documented in the following Level 3 diagrams.

#### UML Diagram

- [View 01 — Backend Entry & Routing](https://github.com/user-attachments/assets/4b456fb0-5a4b-4007-b479-4047bf1f2c90)

### 02 — Authentication Routing & Service

This diagram describes the authentication request flow from API routing to business logic.

The authentication flow is organized into four main layers:

- **RoutesIndex** — Provides the `/api` base path and delegates authentication requests to `/signup`, `/auth`, and `/login`.
- **SignupRouter / AuthRouter / LoginRouter** — Separate authentication endpoints by responsibility and forward requests to the authentication controller.
- **AuthController** — Handles incoming authentication requests, including signup, login, token refresh, logout, and authenticated-user requests.
- **AuthService** — Contains the authentication business logic for OTP processing, signup, login, token management, logout, and authenticated-user retrieval.

The main request flow follows:

`RoutesIndex → Authentication Routers → AuthController → AuthService`

The controller acts as the boundary between HTTP request handling and authentication business logic, while `AuthService` performs the application-level authentication operations.

Request-security middleware such as rate limiting and authentication guards may be applied to authentication routes. The middleware structure is documented separately in **05 — Request Pipeline & Middleware**.

#### UML Diagram

- [View 02 — Authentication Routing & Service](https://github.com/user-attachments/assets/2c44cab0-c803-4f50-8674-9f234e1f6040)

### 03 — Authentication Security & Token Management

This diagram describes how `AuthService` interacts with security utilities, token persistence, and authentication logging.

The authentication security layer is composed of the following components:

- **OtpUtil** — Generates and hashes OTP values used during signup and login verification.
- **JwtUtil** — Signs and verifies access and refresh tokens.
- **RefreshTokenUtil** — Manages the refresh token lifecycle, including hashing, storage, lookup, revocation, and expired-token cleanup.
- **Prisma** — Provides persistence for authentication-related data and refresh tokens.
- **AuthLogger** — Records authentication-related events for monitoring and debugging.

The main security flow is coordinated by `AuthService`:

`AuthService → Security Utilities → Prisma`

`AuthService` uses the security utilities for OTP generation, token signing, token verification, and refresh token management.

Refresh token operations are persisted through Prisma, while authentication events are recorded through `AuthLogger`.

This diagram focuses on the security and token lifecycle used by the authentication service. Database entity relationships and persistence models are documented separately in **04 — Data Model & Persistence**.

#### UML Diagram

- [View 03 — Authentication Security & Token Management](https://github.com/user-attachments/assets/82c633f6-67ed-467c-92b5-07375428d665)
