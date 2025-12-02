# Changelog

---

## [2025-08-18] – [2025-08-22] — Initial Update After First Push

### LoginUI
- Initial implement the login function, starting with the login screen for each Facebook, Google, Appl and Phone number.
- Removed all related to MainServiceUI including `package.json` and `package-lock.json`.
- Fix the logo image, reduced size to 4KB but increased to 25KB after removed the background. 

### Facebook Login
- Added screen/services/facebookAuth.ts, login process
- `AuthoptionsScreen.tsx`, attached `onPress` handler to navigate the screen.

### Learned
- The method in `facebookAuth.ts` calling the login page resource from Facebook.
- It need to configure the app id in manual secure some tasks for Facebook app.

## [2025-08-25] – [2025-08-29] 

### Facebook Login
- Created the ID with creating the app
- Integreated the Facebook login page, calling the login form from Meta officialy.
- Uses API endpoint, user's name and eamil after login.

### AuthOptinosScreen.tsx
- Uses `useFacebookAuthRequest` import from `facebookAuth.ts`
- Navigates based on Facebook login result

### facebookAuth.ts
- Implements the hook-based login using `expo-auth-session`
- Handles `response` using `useEffect`

## [2025-12-01] – [2025-12-02] — feature/fb-login-bypass
- Created `experiment/fb-login-implicit` and keep this code until I can convert to `dev-client` mode later.
- Working `feature/fb-login-bypass`, integrate the system that Facebook login button click and then navigate the screen, temporary system for the first portfolio v1(clear). 


