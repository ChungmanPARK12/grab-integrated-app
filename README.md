
# Grab Integrated App – Portfolio v1

![Image](https://github.com/user-attachments/assets/5408f9e6-c53f-4aa6-9cf0-20af59ffb9e9)

A React Native + Expo mobile app inspired by the Grab super app.  
This project integrates the LoginUI and MainServiceUI into a single user flow — from splash screen to the main service UI — built as a clean, portfolio-ready mobile app.


## Project Overview

The goal of this project is to demonstrate how I design and build a real-world mobile app flow:

- Splash → Loader → Intro Login → Auth Options → Main Service UI
- Clean navigation structure using React Navigation
- Login options:
- **Facebook**
- **Google**
- **Apple**
- **Mobile Number**

- **Portfolio v1**: all four login buttons currently use a temporary bypass to enter the main service screen (no real OAuth yet)

This repository is part of my developer portfolio, showcasing:
- Mobile UI/UX implementation with React Native and Expo
- Practical app structure that can be extended with real OAuth and backend integration in future versions

## Full App Flow

Below is the complete user journey implemented in Portfolio v1.

### 1. Splash Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/a55f5a7f-db0b-49c8-aa44-8009acaacae0" width="280"/>
</p>

- Displays the Grab brand as the app initializes.

---

### 2. Loader Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/61c3a4be-9c42-4804-a47c-ff333579e562" width="280"/>
</p>

- Shows a brief loading animation before moving to the intro screen.

---

### 3. Intro Login Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/5f2077d8-e341-4942-ac44-943cab8169fb" width="280"/>
</p>

- Introduces the Grab brand and guides the user into the login flow.  
- In Portfolio v1, only the **Log In** button is active and proceeds to the authentication options screen.

---

### 4. Auth Options Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/171ba020-f8df-4b9d-a234-44652003d98c" width="280"/>
</p>

- Provides multiple login options **Facebook**, **Google**, **Apple**, and **mobile number**.  
- For **Portfolio v1**, all login buttons use a temporary bypass and navigate directly to the main service UI.  
- **Facebook OAuth** integration is currently under development and will be fully tested in Expo **dev-client** mode in upcoming versions.

---

### 5. Main Service – Blinking UI
<p align="center">
  <img src="https://github.com/user-attachments/assets/7b918b34-0db6-49d2-b523-7d2288d0d039" width="280"/>
</p>

- Displays a blinking skeleton UI while all service icons and images are loading.  
- The main service layout is shown only after every asset has fully loaded, ensuring a smooth and consistent user experience.

---

### 6. Main Service – Dynamic Promotion Cards

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

### 6. Main Service –  Travel & Reward

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


---





