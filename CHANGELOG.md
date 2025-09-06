# Changelog

---

## [2025-09-01] – [2025-09-05] — First integration

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




