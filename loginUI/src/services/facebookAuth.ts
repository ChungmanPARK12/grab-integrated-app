// src/loginUI/src/services/facebookAuth.ts
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest, ResponseType, AuthRequestConfig } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const FB_APP_ID = '1473232010661308';
const EXPO_USERNAME = 'chungmanpark';
const EXPO_SLUG = 'grab-integrated-app';

export const fbDiscovery = {
  authorizationEndpoint: 'https://www.facebook.com/v19.0/dialog/oauth',
};

function getRedirectUri() {
  return `https://auth.expo.io/@${EXPO_USERNAME}/${EXPO_SLUG}`;
}

export const useFacebookAuthRequest = () => {
  const redirectUri = getRedirectUri();

  const config: AuthRequestConfig = {
    clientId: FB_APP_ID,
    redirectUri,
    responseType: ResponseType.Token,
    usePKCE: false, // important
    scopes: ['public_profile', 'email'],
    extraParams: { display: 'touch', auth_type: 'rerequest' },
  };

  const [request, response, promptAsync] = useAuthRequest(config, fbDiscovery);

  // ✅ log BEFORE returning
  console.log('🧪 usePKCE from hook =', config.usePKCE);
  console.log('🧪 request.codeChallengeMethod =', (request as any)?.codeChallengeMethod);

  return {
    request,
    response,
    promptAsync,
    redirectUri,
    discovery: fbDiscovery,
    usePKCE: config.usePKCE,
  };
};
