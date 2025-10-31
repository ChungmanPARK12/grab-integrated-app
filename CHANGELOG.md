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

### [2025-09-15] – [2025-09-20] 

### The integrated level discussion and improvement of the structure(grag-integrated-app)
- `eslint.config.js` for JavaScript and TypeScript code, helps maintain consistent coding style, catch bugs, it's essential in `top-level-project` integration the system, configuration at the root. 

- `expo-env.d.ts` is a TypeScript declaration file that Expo sometimes auto-generates, helps TypeScript compiler(env.PUBLIC_API_KEY). This is also keep only at the root, grab-integrated-app.

- `tsconfig.json` is the TypeScript compiler's configuration file

### Learned
- They don't need separate `eslint.config.js` files because they inherit the configuration from the root.
- `tsconfig.js` is basically the TypeScript compiler's configuration file, support(tells) the TypeScript compiler how to read, check, and compile your code. 
- `loginUI` and `mainServiceUI` is module now and they will be reading at the root in `grab-integrated-app` which is top-level-project.
- `package.json` is main controller, manage like project name, version, scripts, tools like Typyscript or devpendencies like functions, shopping list.
- `package.lock.json` is receipt of the controller, records everthing mentioned in `packge.json`, not allow to touch in manually, just delete and reinstall so auto-generate. 

### System integration plan
- Since grab-integrated-app is the root project, ignore or delete the `package.json` in loginUI and mainServiceUI.
- Add any missing dependencies, essential part from `loginUI` and `mainServiceUI` into the root, `expo-auth-session` from loginUI and `@react-native-async-storage` from mainServiceUI.
- Upgraded all dependencies to match Expo SDK 53 requirements, ex(`npx expo install @react-native-async-storage/async-storage expo-auth-session expo-dev-client react-native`).
- Ran `npx expo-doctor` 17 checks passed.

### [2025-09-22] – [2025-09-27]

### Expo SDK version mismatch between SDK 53 and 54
- Force to reinstall only versions expo SDK 53. 
- Expo SDK 53 support Node.js 20.x.x so it needs to be upgrade. 
- Still version collision between SDK 53 requiring(ex.React 19) and current project in React 18. The fundamental issue is downgrade SDK 54 to 53.

### npm vs npx expo

## npm
- Just reads your `package.json`.
- Doesn't knoe about Expo SDK.
- Can Pull incompatible versions.

## npx expo 
- In my case, Expo SDK 53 must be correct Node.js version with 20.
- It checks your Expo SDK version.
- It installs the correct versions of `react, react-native, react-dom`, and all Expo modules.

### Need npx expo install(npm install) - 2025-09-25
- Need install SDK 53 to npx expo install, now SDK 54
- Also need React 19 to SDK 53, now React 18

- Needed to fix react-native 79.x to 74.5
- So sucessful to install npm install react 19 and react-native 74.5 

### Suspicious the issue for mismatch from devDependencies - 2025-09-26
- Correct dependencies, Expo SDK 53, react: 19.0.0, react-dom: 19.0.0, react-native: 0.79.5.
- Mismatch devDependencies, @typs/react: 18.2.6, typesctipe: 5.3.3.

### [2025-09-24] - Dependency Fix and SDK Alignment

## Fixed
- Downgraded from Expo SDK 54 to 53 for compatibility with integrated project(loginUI and mainServiceUI).
- Aligned React 18.x to 19.0.0(required by SDK 53).
- Updated `package.json` dependencies to match SDK 53 expected versions. 
- Resolved repeated peer dependency conflicts(`react, react-dom, react-native, @types/react`).
- Bypassed strict dependency checks using `npm install --legacy-peer-deps` after `npx expo install` failed.

## Verified
- Ran `npx expo-doctor`, 17/17 checks passed, no issues detected. 
- Project dependencies are now aligned: Expo 53 + React 19 + React Native 0.79.5.

## Learned
- `npx expo install` is recommended for Expo projects but fails if versions are already mismatched. 
- `npm install --legacy-peear-dpes` can resolve conflicts in broken states by bypassing strict peer dependency checks. 
- Expo SDK 53 requires React19, while SDK 54 allows React 18, mixing them causes hard to resolve errors. The one of the reason why `npx expo install` failed. 

### [2025-09-24] - The issue that invalid hook call with useState.
- Suspicious to different React instances are loaded at the same time. 

## Verified
- Checked React version installed good.
- Removed the second <NavigationContainer> from loginUI, keep it only at the root(App.tsx)

### [2025-09-29] – [2025-10-03] - Error, Invalid hook call

## Verified
- The version of React is correct and the function component `LoginNavigator` is correct.

## Suspicious
- The `loginUI` and `mainServiceUI` coped in here, they had their own node_modules and package.json earlier which means probalby two React installs.

## Fix plan
- Remove `node_modules` folders and their lockfiles, `package-lock.json` etc...

# System Integratino Success - [2025-09-30].
- Downgrated to Expo SDK 53 for stability with navigation and UI packages.
- React upgraded to 19.x.x to align with Expo SDK 53 requirements. 
- Removed duplicate `node_modules, package-lock-json` and legacy `package.json` files inside `loginUI, mainServiceUI`.
- Consolidated all dependencies into the root `package.json` only.
- Performed a clean reinstall with `mpn install --legacy-peer-deps` to resolve version conflict.

## Learned
- Hooks error `Invalid hook call` always means duplicate React in sub-projects.
- When merging multiple UIs, only one root dependency tree is allowed.

## What caused the version conflict

# Expo SDK mismatch
- `grab-integrated-app` were using SDK 54, it uses React18.x officially, but suspicious that `loginUI, mainServiceUI` eadh had their own `package.json, node_modules` and they were installed SDK 53 against SDK 54, so conflict mismatch React. 
- To downgrade to SDK 53, needed to clean `loginUI, mainServiceUI`, all dependency materials only one in the root which is `grab-integrated-app`.

## [2025-10-01] - Facebool login
- Fixed `MainServiceScreen` in mainServiceUI and added `type` navagation object and `nevigation` function so convert screen from LoginUI after logging in Facebook.

# App active issue for Facebook login
- Needed to verify to active app in my Meta developer account. 
- Still need to update some in the dashboard.

### [2025-10-06] – [2025-10-11] - The process of Facebook verification for login function

- Clear uploading a App Icon.
- Next step, Privacy Policy URL, create a new repo put policy content in `index.html`.

### [2025-10-13] – [2025-10-18] - The process of Facebook verification for login function
- Create git repo for Privacy Policy URL, `grabloginui-privacy` as Meta requires a public HTTPS URL.
## Facebook dachbord in GrabLoginUI
- Updated Privacy Policy, Data deletion instructions and Tems of service and `site URL`.
## Use Case, , Authenticate and request data from users with Facebook Login, settings
- Added `Valid OAuth Redirect URLs`.
## The facebokAuth.ts logic
- Updated `redirectUri` using `Authsession.makeRedirectUri()` for expo Go auto proxy handling. 
- Clean up unused `useProxy` parameter(removed) to match lastest Expo SDK types. 
## The AuthOptionsScreen
- Simplified `promptAsync()` call with auto proxy request. 
## [2025-10-16] - Need business verification(Facebook restrction)
- Have some issue setting the app to active(Go to live button).
- My app will stays in Development mode until finish Business Verification.

### [2025-10-20] – [2025-10-25] - Check list
- App roles, added user as an Administrator(Clear)
- OAuth settings, redirectURL(Clear), next debugging `facebookAuth.ts`, print redirect URL.
## Suspicious and diagnosis
- Error because using URL from loginUI but it should be the URL from grab-integrated-app which is root project.
- Currently the app using the local dev Uri(expo go) so it need the https which restrict from factbook and I got the option to use `useProxy` again.
- Concern using `useProxy` is mismatched with the SDK.

# [2025-10-22] - Option A
- Keep using Expo Go and Add `Valid OAuth Redirect URIs`.
- No `useProxy` in `promptAsync` which occur error becuase of the mismatch SDK.
- Put `useProxy:true` into `makeRedirectUri`.

# [2025-10-23] - Successful output the http link by force the useproxy URL.
- Need to complete the test user(diagnosis so far), Review -> Testing, Test Complete and then Publish, go to app Live.

# [2025-10-24] - Graph API Explorer
- Generated user access token, permisions adding email and public_profile, GET id and name. 
- Ready to add facebook account as a Tester to app Live.
- Reset history safari and then loged in again clickling facebook login button, continue as chungman but error, something went wrong.

### [2025-10-30] – [2025-11-01] - Diagnosis that Auth URL issue for facebook login

## Debugging
- Clear for heck print `client_id=1473232010661308`, `redirect_uri=https://auth.expo.io/@chungmanpark/grab-integrated-app`.
- It times out(never returns to the app), `promptAsync` is an Expo account mismatch somereason.
























