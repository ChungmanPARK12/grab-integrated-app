// loginUI/navigation/types.ts
export type AuthStackParamList = {
  Login: undefined;
  AuthOptions: undefined;
  GetStartedSignup: undefined;
  VerifyOtp: { phoneNumber: string; countryCode: string };
  GetStartedName: { phoneNumber: string; countryCode: string };
};
