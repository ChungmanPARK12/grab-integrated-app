
# Grab Integrated App – Portfolio v1

![Image](https://github.com/user-attachments/assets/5408f9e6-c53f-4aa6-9cf0-20af59ffb9e9)

A React Native + Expo mobile app inspired by the Grab super app.  
Built through direct app experience with AI supporting, this project presents a portfolio-ready format — not through cloning, but through analysis and redesign.


## Project Overview

This project demonstrates how I design and implement a real-world mobile service flow in React Native with Expo.
It covers the onboarding and authentication experience from app launch to the main service screen, and now includes backend-connected sign-up verification.

The project focuses on:

- Clean navigation architecture
- Backend-connected authentication flow
- OTP-based sign-up verification
- Accurate loading behaviors
- UX patterns inspired by the real Grab app 

## Features

- **Startup flow**: Splash → loading status (spinner) → login screen
- **Authentication entry points UI** (Facebook, Google, Apple, Mobile)
- **Backend-connected mobile sign-up flow**
- **OTP verification flow** using `requestId` and expiration-based validation
- **Sign-up completion flow**: Sign-up → OTP verification → profile input → Main Service screen
- **Main Service UI skeleton placeholders** for smoother perceived loading while assets render
- **PromoBanner synchronized loading** so banner image and card icons appear together
- **Backend foundation**
  - Node.js + Express authentication API
  - Prisma ORM for database access
  - PostgreSQL for persistent user / OTP / token data
  - JWT-based temp / access / refresh token flow
  - Request-based OTP verification with rate limiting and expiration handling
- **Local development & testing environment**
  - Backend server and database run locally using Docker
  - ngrok used to expose local API endpoints for mobile device testing
  - Enabled real-device integration between React Native app and local backend

## Implementation Notes

- Temporary login bypass applied for **Portfolio v1**
  - Bypass is used for **social login options (Facebook, Google, Apple)** to allow direct access to the Main Service UI during development
- Authentication and Facebook OAuth flow planned for future **dev-client** mode testing once verification is approved

## Full App Flow

This section outlines the full application flow, from launch to the main service screen.

Full app flow details are documented here:

- [Full App Flow Documentation](portfolio/fullappflow/full-app-flow.md)

## Installation

- **IDE**  
  Use any preferred editor. **Visual Studio** Code is recommended for JavaScript/TypeScript development.  
  https://code.visualstudio.com/

- **Node.js**  
  Required for React Native and Expo development tools.  
  https://nodejs.org

- **Clone the Repository**:
   ```bash
   git clone https://github.com/ChungmanPARK12/grab-integrated-app.git
   cd grab-integrated-app
   ```

- **Install Dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## Getting Started

This project uses the modern Expo workflow.  
Once dependencies are installed, you can start the development server and run the app on a mobile device.

### Start the Development Server
```bash
npx expo start 
```

**Note(WSL):** If the app does not open on a physical device due to network of IP configuration issues, use:
```bash
npx expo start -tunnel 
```

### Run the App
Use **Expo Go** on your Android or iOS device to run the app.

Scan the **QR code** shown in the terminal, and Expo Go will automatically open and load the project.

### Troubleshooting

If the app behaves unexpectedly or changes are not reflected, try clearing the cache:

```bash
npx expo start -c
```
Then restart the app using `npx expo start --tunnel`

## Debugging

### Facebook Login Issue

**Source:** `loginUI/src/services/facebookAuth.ts`

#### Expo Go Redirect Limitation
Expo Go forces `useProxy: true`, meaning the OAuth redirect goes through Expo’s proxy server instead of a native URI.  
Since Facebook does not support this flow, the app cannot receive the callback — confirming that a custom **dev-client** is required for proper Facebook login support.

---

### Authentication Flow Debugging

**Tools:** Postman, Express API, Prisma + PostgreSQL  

#### 1. OTP Request & Rate Limiting
- Tested `/api/signup/phone`
- Identified and handled **rate limiting (60s)**
- Resolved `429 too many requests` issue during rapid requests
- Ensured OTP is only issued after cooldown

#### 2. Token Issuance Flow (Signup → JWT)
- Verified `/api/signup/otp` → `tempToken` issuance
- Confirmed JWT payload structure and expiration
- Tested full flow:
  - OTP verification → tempToken
  - username registration → accessToken & refreshToken
- Ensured correct transition between authentication stages

---

- Detailed debugging notes are documented in `CHANGELOG.md`.

## Expo Workflow & Environment

### Expo Go
**Expo Go** is used to preview and test UI/UX directly on a real mobile device.

### npx expo
`npx expo` runs the Expo CLI without a global installation.
It is used to start the development server, manage the Metro bundler, and generate the **QR code** for Expo Go.

### Environment Versions
The project was developed and tested with the following environment:

- **Node.js**: v20.x
- **Expo CLI**: via `npx expo`
- **React Native**: 0.81.x (Expo-managed)
- **Expo SDK**: SDK 54
- **Tested on**:
  - iOS (Expo Go)
  - Android (Expo Go) 

Exact SDK and dependency versions are defined in `package.json` and `app.json`.

## Recently Completed Improvements

- Restructured **root-based navigation**
- Centralized Auth / Main flow control at the app root
- Completed **backend-connected Sign-up flow**
- Implemented **OTP-based verification with expiration and rate limiting**
- Integrated **JWT authentication flow** (tempToken → accessToken → refreshToken)

## Next Steps

- Implement **mobile number login flow** (OTP-based login)
- Connect `AuthOptionsScreen` login buttons to real backend authentication

## License

This project is licensed under the MIT License.














