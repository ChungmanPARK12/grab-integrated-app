// src/loginUI/services/facebookAuth.ts
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { ResponseType, makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { useCallback, useMemo, useRef } from 'react';

// ✅ Verify and complete any pending auth session (must run only once per file)
WebBrowser.maybeCompleteAuthSession();

// Default constants
const FALLBACK_PROJECT = '@chungmanpark/grab-integrated-app';
const FB_AUTH_ENDPOINT = 'https://www.facebook.com/v24.0/dialog/oauth';

// ✅ Facebook App ID: Loaded from environment variables / expoConfig / or fallback order
//    (Previously defined inside AuthOptionsScreen, now moved and consolidated here)
const FACEBOOK_APP_ID: string =
  process.env.EXPO_PUBLIC_FACEBOOK_APP_ID ||
  (Constants.expoConfig?.extra as any)?.facebookAppId ||
  '1473232010661308';

// Only access `params` when the response.type === 'success', redirectURI(datas)
type SuccessResult = { type: 'success'; params?: Record<string, string> };

// ✅ Return type for AuthOptionsScreen when calling login()
export interface FacebookLoginResult {
  ok: boolean;
  cancelled?: boolean;
  accessToken?: string;
  errorMessage?: string;
}

/**
 * useFacebookLogin
 *
 * - Handles everything related to Facebook OAuth inside this hook:
 *   Facebook App ID, redirectUri generation, and AuthSession configuration.
 * - The UI layer (AuthOptionsScreen) only needs to call login() and handle the result.
 */
export function useFacebookLogin() {
  // ✅ Consolidated Facebook App ID
  const facebookAppId = FACEBOOK_APP_ID;

  // Read Expo Config values
  const owner = Constants?.expoConfig?.owner;
  const slug = Constants?.expoConfig?.slug;
  const scheme = (Constants?.expoConfig as any)?.scheme || 'grabintegratedapp';
  const projectForProxy = owner && slug ? `@${owner}/${slug}` : FALLBACK_PROJECT;

  /**
   * Configure redirectUri
   * - Expo Go: Always uses https://auth.expo.io/@owner/slug (same as in Facebook Developer Console)
   * - Dev Client / Production: Uses a custom scheme from app.json (e.g., grabintegratedapp://redirect)
   */
  const redirectUri = useMemo(() => {
    const ownership = Constants.appOwnership; // expo | standalone | guest
    console.log('[FB] appOwnership =', ownership);

    if (ownership === 'expo') {
      // ✅ Expo Go environment: Uses proxy redirect (auth.expo.io)
      return `https://auth.expo.io/${projectForProxy}`;
    }

    // ✅ EAS Dev Client / Standalone: Uses a custom URI scheme like grabintegratedapp://redirect
    const uri = makeRedirectUri({ scheme });
    console.log('[FB] redirectUri (non-Expo) =', uri);
    return uri;
  }, [projectForProxy, scheme]);

  // Facebook OAuth discovery endpoint
  const discovery = useMemo(
    () => ({ authorizationEndpoint: FB_AUTH_ENDPOINT }),
    []
  );

  // Expo Auth Request Hook
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: facebookAppId,
      responseType: ResponseType.Token,
      scopes: ['public_profile', 'email'],
      redirectUri, // ✅ Apply actual redirect URI
    },
    discovery
  );

// Prevent duplicate login calls
const busyRef = useRef(false);

/**
 * Login function
 * - Expo Go → useProxy: true (auth.expo.io)
 * - Dev Client / Standalone → custom scheme (grabintegratedapp://)
 *
 * 👉 This is the main method used by AuthOptionsScreen:
 *    - The button triggers login() only once.
 *    - This function handles:
 *        · calling promptAsync()
 *        · processing the OAuth response
 *        · logging and validating the OAuth state value
 */
const login = useCallback(async (): Promise<FacebookLoginResult> => {
  if (!request) {
    console.log('[FB] login() called but request is not ready');
    return {
      ok: false,
      errorMessage: 'Facebook Auth request is not ready yet.',
    };
  }

  if (busyRef.current) {
    console.log('[FB] login() ignored: another login is in progress.');
    return {
      ok: false,
      errorMessage: 'Another Facebook login is already in progress.',
    };
  }

  busyRef.current = true;

  try {
    const useProxy = Constants.appOwnership === 'expo';

    console.log('▶️ promptAsync({ useProxy: %s, prefersEphemeralSession: true })', useProxy);
    console.log('   redirectUri =', redirectUri, 'state =', request.state);

    const res = await promptAsync({
      useProxy,
      // Avoid iOS Safari cookie/session interference
      prefersEphemeralSession: true,
    } as any);

    console.log('⏮ login() result.type =', res?.type);

    // === Handle response + migrate STATE validation logs from AuthOptionsScreen ===
    const reqState = request?.state;
    let respState: string | undefined;

    if (res?.type === 'success') {
      const success = res as SuccessResult;
      respState = success.params?.state;
    }

    console.log(
      '🧪 STATE CHECK -> request.state =',
      reqState,
      '| response.state =',
      respState,
      '| type =',
      res?.type
    );

    if (!res) {
      return { ok: false, errorMessage: 'No response from Facebook.' };
    }

    if (res.type === 'success') {
      const success = res as SuccessResult;
      const token = success.params?.access_token;

      if (token) {
        console.log('[FB] access_token retrieved successfully');
        return { ok: true, accessToken: token };
      }

      console.log('[FB] Logged in, but no access_token found.');
      return {
        ok: false,
        errorMessage: 'Logged in, but no access_token found.',
      };
    }

    // Cases where the user closes or cancels the login browser window
    if (res.type === 'cancel' || res.type === 'dismiss') {
      console.log('ℹ️ FB flow result type (cancel/dismiss):', res.type);
      return { ok: false, cancelled: true };
    }

    // Error cases
    if (res.type === 'error') {
      const errorMessage =
        (res as any).error?.message ?? 'Facebook login failed with unknown error.';
      console.log('💥 FB login error:', errorMessage);
      return {
        ok: false,
        errorMessage,
      };
    }

    // Other unexpected states (locked, opened, etc.)
    console.log('ℹ️ FB flow result type (other):', res.type);
    return {
      ok: false,
      errorMessage: `Facebook login finished with type: ${res.type}`,
    };
  } catch (e: any) {
    console.error('💥 FB login exception:', e);
    return {
      ok: false,
      errorMessage: e?.message ?? 'Unexpected error during Facebook login.',
    };
  } finally {
    busyRef.current = false;
  }
}, [promptAsync, redirectUri, request]);

// 🔍 Debugging: Generate the authorize URL (previously calculated inside AuthOptionsScreen)
const authUrl = useMemo(
  () => (request as any)?.url ?? '',
  [request]
);

return {
  request,
  redirectUri,
  authUrl,          // Used by debug buttons in AuthOptionsScreen
  login,            // ✅ Main login method used by AuthOptionsScreen
  response,         // (Optional) Exposed for future extensions
  promptAsync,      // (Optional) Exposed for advanced usage
  facebookAppId,    // Exposed for debugging logs in AuthOptionsScreen
};
}

export default useFacebookLogin;
