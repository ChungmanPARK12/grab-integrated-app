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
