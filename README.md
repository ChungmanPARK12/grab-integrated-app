
# Grab Integrated App – Portfolio v1

![Image](https://github.com/user-attachments/assets/5408f9e6-c53f-4aa6-9cf0-20af59ffb9e9)

A React Native + Expo mobile app inspired by the Grab super app.  
Built through direct app experience with AI supporting, this project presents a portfolio-ready format — not through cloning, but through analysis and redesign.


## Project Overview

This project demonstrates how I structure and implement a real-world mobile service flow in React Native.
It covers the full onboarding and authentication flow, from initial app launch through login and into the main service experience.

- Clean navigation architecture.  
- Accurate loading behaviors.  
- UX patterns inspired by the real Grab app.  

## Features

- **Startup flow**: Splash → loading status (spinner) → login screen
- **Multiple authentication entry points** (Facebook, Google, Apple, Mobile)
- **Portfolio v1 login bypass** to enter the Main Service UI for demo purposes
- **Main Service UI skeleton placeholders** for smoother perceived loading while assets render
- **PromoBanner synchronized loading** so banner image and card icons appear together

## Implementation Notes

- Temporary login bypass applied for **Portfolio v1**
- - Authentication and Facebook OAuth flow planned for future **dev-client** mode testing once verification is approved.

## Full App Flow

This section outlines the full application flow, from launch to the main service screen.

Full app flow details are documented here:

- [Full App Flow Documentation](docs/full-app-flow.md)

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
If the app does not open with the default Expo start command, using `--tunnel` can improve connectivity in some network environments.

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
This is a temporary solution and will be refactored in **Portfolio v2**.

- Detailed debugging notes and iteration history are documented in `CHANGELOG.md`.

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
- **React Native**: 0.79.x (Expo-managed)
- **Expo SDK**: SDK 53
- **Tested on**:
  - iOS (Expo Go)
  - Android **(not tested yet)**

Exact SDK and dependency versions are defined in `package.json` and `app.json`.

## Next Steps (Portfolio v2)

- Update the **Expo Go** app on test devices before starting Portfolio v2 development
- Test the app on an **Android** physical device.
- Refactor the **skeleton blinking** logic for better stability and consistency across main service components.

## License

This project is licensed under the MIT License.














