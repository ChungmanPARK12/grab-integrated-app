
# Grab Integrated App – Portfolio v1

![Image](https://github.com/user-attachments/assets/5408f9e6-c53f-4aa6-9cf0-20af59ffb9e9)

A React Native + Expo mobile app inspired by the Grab super app.  
Built through direct app experience and AI-assisted iteration, portfolio-ready format — not through cloning, but through analysis and redesign.

## Project Overview

This project demonstrates how I structure and implement a real-world mobile service flow in React Native.

It covers the complete onboarding experience:

**Splash → Loader → Intro Login → Auth Options → Main Service UI**

The focus is on:
- Clean navigation architecture.  
- Accurate loading behaviors.  
- UX patterns inspired by the real Grab app.  

This repository is part of my portfolio, showing:
- Temporary login bypass for **Portfolio v1**.
- A UI/UX foundation prepared for Facebook OAuth, to be tested in **dev-client** mode in the future once verification is approved.

## Features

### Onboarding Flow
- Full onboarding sequence from splash to main service screen.  
- Smooth transitions with controlled loading states (splash delay, background image loading).

### Authentication Options
- Four entry points: Facebook, Google, Apple, Mobile Number.  
- All temporarily bypass to Main Service UI in **Portfolio v1**.  
- Facebook OAuth planned for future **dev-client** mode testing once verification is approved.

### Loading & Rendering Behavior
- Blinking skeleton placeholders across key UI components.  
- Asset-ready rendering pattern: components display only after images and icons fully load.  
- PromoBanner uses independent loading control for both banner image and card icons.

## Full App Flow

This section outlines the full application flow, from launch to the main service screen.

Full app flow details are documented here:  
[docs/full-app-flow.md](docs/full-app-flow.md)

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
npx expo start --tunnel
```

### Run the App
Use **Expo Go** on your Android or iOS device to run the app.

Scan the **QR code** shown in the terminal, and Expo Go will automatically open and load the project.

### Troubleshooting
If the Expo server does not start, try cleaning the cache:
```bash
npx expo start -c
```

## Debugging

### Facebook Login Issue

**Source:** `loginUI/src/services/facebookAuth.ts`

#### Expo Go Redirect Limitation
Expo Go forces `useProxy: true`, meaning the OAuth redirect goes through Expo’s proxy server instead of a native URI.  
Since Facebook does not support this flow, the app cannot receive the callback — confirming that a custom **dev-client** is required for proper Facebook login support.

### Main Service UI (Asset Loading)

**Source:** `mainServiceUI/src/components/PaymentPanel.tsx`

During the **skeleton blinking** implementation, the UI occasionally became stuck in the loading state, or rendered icons out of sync.  
To stabilize the experience, the component preloads icons invisibly during the skeleton phase so the final content appears all at once after loading completes.
The blinking logic requires further refactoring and will be improved in **Portfolio v2**.

- Detailed debugging notes and iteration history are documented in `CHANGELOG.md`.

## Expo Workflow & Environment

This project uses the modern Expo workflow to simplify development and testing during the early stages.

### Expo Go
**Expo Go** is used to preview and test UI/UX directly on a real mobile device.

### npx expo
`npx expo` runs the Expo CLI without a global installation.
It is used to start the development server, manage the Metro bundler, and generate the **QR code** for Expo Go.

### Environment Versions
The project was developed and tested with the following environment:

- **Node.js**: v20.x
- **Expo CLI**: via `npx expo`
- **React Native**: 0.79.5 (Expo-managed)
- **Expo SDK**: SDK 50
- **Tested on**:
  - iOS (Expo Go)
  - Android **(not tested yet)**

Exact SDK and dependency versions are defined in `package.json` and `app.json`.

## Next Steps (Portfolio v2)

- Align **Expo Go** updates with project SDK versions.
- Test the app on an **Android** physical device.
- Refactor the **skeleton blinking** logic for better stability and consistency across main service components.














