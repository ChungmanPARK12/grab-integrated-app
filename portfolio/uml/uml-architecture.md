# Grab Integrated App — UML Architecture

## Overview

This document describes the architecture of the Grab Integrated App using UML diagrams.

The UML documentation is organized into multiple levels, with each level serving a different purpose.

- **Level 1** provides a high-level architectural overview.
- **Level 2** describes major packages and their dependency relationships.
- **Level 3** provides detailed implementation-level architecture for development reference.

The current documentation primarily focuses on the backend architecture.

---

# Backend Architecture

The architecture documentation begins with a high-level view of the overall system and progressively expands into the internal backend structure.

Level 1 shows how the Mobile Client, Backend API, and Database interact, while Level 2 and Level 3 focus on the internal backend architecture and implementation details.

This approach allows the overall system flow to be understood first before examining individual backend modules and dependencies.

---

## Level 1 — System Architecture Overview

Level 1 provides a high-level overview of the Grab Integrated App and shows how the major system components communicate with each other.

The architecture is divided into three main components:

- **Mobile Client** — Built with React Native and Expo, providing the mobile application interface.
- **Backend API** — Built with Node.js and Express, handling API requests from the mobile client.
- **PostgreSQL Database** — Provides persistent data storage for the backend.

The Mobile Client communicates with the Backend API through HTTP-based REST APIs.

The Backend API accesses the PostgreSQL database through Prisma ORM, which provides the data access layer between the application and the database.

This level focuses only on the overall system structure and technology boundaries. Internal backend components such as routes, controllers, services, middleware, authentication logic, and security utilities are intentionally excluded and are documented in the lower-level architecture diagrams.

### UML Diagram

- [View Level 1 — System Architecture](https://github.com/user-attachments/assets/e7dac884-0eb3-476c-ae12-f6bb8f76d038)
