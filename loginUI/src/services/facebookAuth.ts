// services/facebookAuth.ts
import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from 'expo-auth-session';
import { useEffect } from 'react';

// Facebook App ID
const FB_APP_ID = '1473232010661308'; // Replace with your real Facebook App ID

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://www.facebook.com/v10.0/dialog/oauth',
};

export const useFacebookAuthRequest = () => {
  const redirectUri = makeRedirectUri({
    scheme: 'grabloginui',
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: FB_APP_ID,
      scopes: ['public_profile', 'email'],
      redirectUri,
      responseType: ResponseType.Token,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      console.log('Facebook access token:', access_token);
      // TODO: handle backend login or token storage
    }
  }, [response]);

  return { request, promptAsync };
};
