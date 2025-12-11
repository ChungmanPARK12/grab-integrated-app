
# Grab Integrated App – Portfolio v1

![Image](https://github.com/user-attachments/assets/5408f9e6-c53f-4aa6-9cf0-20af59ffb9e9)

A React Native + Expo mobile app inspired by the Grab super app.  
Built through direct app experience and AI-assisted iteration, this project reconstructs Grab’s end-to-end user flow in a polished, portfolio-ready format — not through cloning, but through analysis and redesign.

## Project Overview

This project demonstrates how I structure and implement a real-world mobile service flow in React Native.

It covers the complete onboarding experience:

**Splash → Loader → Intro Login → Auth Options → Main Service UI**

The focus is on:
- Clean navigation architecture  
- Accurate loading behaviors  
- UX patterns inspired by the real Grab app  

This repository is part of my portfolio, showing:
- Temporary login bypass for Portfolio v1
- A UI/UX foundation prepared for Facebook OAuth, to be tested in **dev-client mode** in the future once verification is approved.

## Full App Flow

### 1. Splash Screen

<p align="center">
  <img src="https://github.com/user-attachments/assets/a55f5a7f-db0b-49c8-aa44-8009acaacae0" width="280"/>
</p>

- Displays the Grab brand as the app initializes.

---

**Source:** `loginUI/src/screens/LoginNavigator.tsx`  

- Uses a 3-second loading state (`isAppReady`) to display the splash screen before the app becomes interactive.
- Once ready, the navigator renders three main screens (`Login`, `AuthOptions`, `MainService`) inside `Stack.Navigator`, enabling screen navigation.

---

### 2. Loader Screen

<p align="center">
  <img src="https://github.com/user-attachments/assets/61c3a4be-9c42-4804-a47c-ff333579e562" width="280"/>
</p>

- Shows a brief loading animation before moving to the intro screen.

---

**Source:** `loginUI/src/components/LoginScreen.tsx`

- Uses the `bgLoaded` state to show an ActivityIndicator until the image has fully loaded.
- Ensures that users see a clean transitional loading state before the Intro Login screen appears.

---

### 3. Intro Login Screen

<p align="center">
  <img src="https://github.com/user-attachments/assets/5f2077d8-e341-4942-ac44-943cab8169fb" width="280"/>
</p>

- Introduces the Grab brand and guides the user into the login flow.  
- In Portfolio v1, only the **Log In** button is active and proceeds to the authentication options screen.

---

**Source:** `loginUI/src/components/LoginScreen.tsx`

- The intro login UI becomes visible only after the background image has fully loaded (`bgLoaded === true`).

---

### 4. Auth Options Screen

<p align="center">
  <img src="https://github.com/user-attachments/assets/171ba020-f8df-4b9d-a234-44652003d98c" width="280"/>
</p>

- Provides multiple login options **Facebook**, **Google**, **Apple**, and **mobile number**.   
- Facebook OAuth will be implemented in a later version; due to identification requirements, real testing in Expo **dev-client** mode is expected to begin in about six months.  
- An `experiment/fb-login-implicit` branch will be maintained for future OAuth testing and integration work.

---

**Source:** `loginUI/src/components/AuthOptionsScreen.tsx`

- Registers navigation using `useNavigation<NavigationProp>()`.  
- `handleAuthBypass` is a temporary handler that routes all login buttons to `MainService` until real OAuth logic is added.  

---

### 5. Main Service – Blinking UI
<p align="center">
  <img src="https://github.com/user-attachments/assets/7b918b34-0db6-49d2-b523-7d2288d0d039" width="280"/>
</p>

- Displays a blinking skeleton UI while all service icons and images are loading.  
- The main service layout is shown only after every asset has fully loaded, ensuring a smooth and consistent user experience.

---

**Source:** `mainServiceUI/src/screens/MainServiceScreen.tsx`

- Uses a `FlatList` header to render the entire screen as one scrollable layout.  
- Combines all major UI sections (e.g., TopBar, ServiceGrid, PromoBanner) inside a single structured container.  
- Each section handles its own blinking placeholder and switches to real content after loading its assets.

---

### 6. Main Service – Home Header & Dynamic Promotion Cards

<div align="center">
<table>
  <tr>
    <td align="center"><strong>Travel Pass</strong></td>
    <td align="center"><strong>Food Deals</strong></td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/11514474-3277-43ff-b353-84c1f5986a30" width="280"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/ce4930c7-f0d7-47e4-961c-1dfb99144565" width="280"/>
    </td>
  </tr>
</table>
</div>

- The app alternates between **Travel Pass** and **Food Deals** on each launch, creating a more dynamic main service experience.

---

**Sources:**  
`mainServiceUI/src/components/TopBar.tsx`  
`mainServiceUI/src/components/ServiceGrid.tsx`  
`mainServiceUI/src/components/PaymentPointsSection.tsx`  
`mainServiceUI/src/components/PromoBanner.tsx`

- Inspired by the real Grab app experience, alternating banner types using `AsyncStorage` on each launch. 
- Uses `Animated.Value` to show a blinking placeholder while assets load.  
- Renders the full banner only after the main image and all icons have finished loading.

---

### 6. Main Service –  Restaurents & Dicovery Cards

<div align="center">
<table>
  <tr>
    <td align="center"><strong>Variation 1</strong></td>
    <td align="center"><strong>Variation 2</strong></td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/aadf139e-056c-4d0e-9378-b4dbfb015d96" width="280"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/8871acf0-602e-4f75-800c-42e474c8788d" width="280"/>
    </td>
  </tr>
</table>
</div>

- This screen contains two content sections displayed together:  
- **(1) Restaurants you may like** – six recommendation cards that vary based on the selected layout.  
- **(2) Discover things you’d love** – three promotional cards shown below the restaurant section.  

---

**Source:** 
`mainServiceUI/src/components/RecommendedRestaurants.tsx`  
`mainServiceUI/src/components/DiscoverThings.tsx`

- `RecommendedRestaurants` renders six horizontal recommendation cards using a simple `FlatList`.  
- `DiscoverSection` displays three promotional cards in a second horizontal list beneath the restaurant section.  
- Both components use local image assets and minimal styling to mirror Grab’s real home feed layout.

---

### 6. Main Service – Travel Promotions & Reward Challenges

<div align="center">
<table>
  <tr>
    <td align="center"><strong>Variation 1</strong></td>
    <td align="center"><strong>Variation 2</strong></td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/6709b968-4bcc-4fac-9031-2e95107c4693" width="280"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/2e780c31-4243-49c0-bb46-e3fcc6d89043" width="280"/>
    </td>
  </tr>
</table>
</div>

- This screen contains two content sections shown together:  
- **(1) Travel smarter with Grab** – two promotional travel cards.  
- **(2) Reward Challenges** – two different challenge cards displayed.  

---

**Source:** 
`mainServiceUI/src/components/TravelSmarter.tsx`  
`mainServiceUI/src/components/ChallengesRewarded.tsx`

- `TravelSmarterSection` renders two promotional travel cards in a horizontal list.  
- `ChallengeSection` displays two reward challenge cards with images, dates, and action links.  
- Both sections reuse simple FlatList layouts to mirror Grab’s promotional content structure.






