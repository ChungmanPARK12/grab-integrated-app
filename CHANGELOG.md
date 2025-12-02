# Changelog

---

# [2025-09-01] – [2025-09-05] — First integration

### loginUI
- Copy `GrabLoginUI` to `loginUI` in grap-integrated-app and then sucessfully merged in github.
- Copy `MainServiceUI` to `mainServiceUI` in grap-integrated-app and then sucessfully merged in github.

### MainServiceUI
- Restructuring, organized the folders and files to integrate the structure with LoginUI.
- Suspicious MainServiceUI has been created the project with JS withhout TypeScript compiler.
- It might need to copy it from LoginUI and npm install later 

### Learned
- `{}tsconfig.json` is TypeScript compiler how to behave. 
- `.tsx`, React or React Native component, `.ts`, Services, API, auth...
- Fixed all components to const arrow for consistency, clear function identity and easier refactoring and reading, better using hooks, state, and event handlers, not hoisted which can aviod bugs in large files.

### Codereview

# Renamed MainLoginScreen to LoginNavigator
- React Navigation for components management
- Smoother transitions with `createNariveStackNavigator`.

### LoginScreen
- Added ` accessibilityRole="button"` in ToughableOpacity to improve the quality for screen reader.

### facebookAuth
- It can be improved with that creating key in env for the Facebook ID part, add the key in app.config.ts and App_ID part.
- Learned that integrating with Facebook's OAuth2.0, authorization API endpoint.
- HTTP Request, Response, CRUD - Read, Deep Linking - redirectUri.
- Creates the authorization request including clientId, scopes, redirectUri.
- Handles response from Facebook, access_token, type:success.
- Web API, redirects back to my app after login. 

# [2025-09-07] – [2025-09-12] 

### LoginNavigator.tsx
- Added navigation function, import screen and stack screen in `NavigationContainer`

### AutoOptionScreen
- Added `navigation.navigate('MainService');` in Facebook logging in method.

### LoginScreen
- Consiering separate and integration `export types` in LoginScreen to `types.ts` in another directory. 

### index.js
- Created main entry point with index.js, moved the App.tsx to /app.

### Improve Import Path with TSConfig Aliases
### Changed(Problem solved)
- Removed `tsconfig.json` files from `loginUI/` and `mainServiceUI/` to avoid path resolution conflicts(import error).
- Centralized alias config in root `grab-integrated-app/tsconfig.json`.

### Added
- Path aliases:
  - `@login/*` → `loginUI/src/*`
  - `@main/*` → `mainServiceUI/src/*`

### Learned
- TypeScript only respects one `tsconfig.json` per project.
- Multiple nested `tsconfig.json` files can break path resolution and cause IDE import errors.

### Error
- Invalid hook call, mismaching the versions of React?
- The fundamental issue is that mismatch the version all three of projects, the plan is version match the package.json. 

### Structure
- Integrate the structure and organize for loginUI and mainServiceUI.
## loginUI
- Using only `index.js` as the entry point.
- No `App.tsx` - acceptable for simple loginUI with limited screens
- No `expo-env.d.ts` unless using `expo-router-entry`.
## mainServiceUI
- `index.js` registers the app with Expo.
- `App.tsx` imports and returns the parameta.
## grab-integrated-app
- Planning to structure analysis and integrate the system.






