// src/loginUI/services/facebookAuth.ts
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const FB_APP_ID = '1473232010661308';

// Toggle this when you move to a dev/production build
const USE_PROXY = true; // ✅ true for Expo Go; false for dev build (custom scheme)

const discovery = {
  authorizationEndpoint: 'https://www.facebook.com/v10.0/dialog/oauth',
};

export const useFacebookAuthRequest = () => {
  // ✅ In your SDK, do NOT pass `useProxy`. Let defaults handle proxy in Expo Go.
  const redirectUri = USE_PROXY
    ? makeRedirectUri() // Expo Go → proxy URL (https://auth.expo.io/…)
    : makeRedirectUri({ scheme: 'grabintegratedapp' }); // dev build / standalone

  console.log('🔗 Redirect URI:', redirectUri);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: FB_APP_ID,
      redirectUri,
      responseType: ResponseType.Token,
      scopes: ['public_profile', 'email'],
    },
    discovery
  );

  return { request, response, promptAsync };
};
