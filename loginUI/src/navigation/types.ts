// loginUI/navigation/types.ts

export type AuthStackParamList = {
  Login: undefined;
  AuthOptions: undefined;

  GetStartedSignup: undefined;

  VerifyOtp: {
    phoneNumber: string;
    requestId?: string;
    expiresAt?: string;
    devOtp?: string;
    flow: 'signup' | 'login';
  };

  GetStartedName: {
    phoneNumber: string;
    requestId: string;
    tempToken: string;
  };
};