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
