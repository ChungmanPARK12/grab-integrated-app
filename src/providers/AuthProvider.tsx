// src/providers/AuthProvider.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  PropsWithChildren,
  useCallback,
  useEffect,
} from 'react';

type AuthContextValue = {
  isSignedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  signIn: (
    accessToken: string,
    refreshToken: string,
    reason?: string
  ) => void;
  signOut: (reason?: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    console.log(
      `[Auth] state changed -> isSignedIn=${isSignedIn}, accessToken=${accessToken ? 'set' : 'null'}, refreshToken=${refreshToken ? 'set' : 'null'}`
    );
  }, [isSignedIn, accessToken, refreshToken]);

  const signIn = useCallback(
    (nextAccessToken: string, nextRefreshToken: string, reason?: string) => {
      console.log(
        `[Auth] signIn called${reason ? ` | reason=${reason}` : ''}`
      );

      setAccessToken(nextAccessToken);
      setRefreshToken(nextRefreshToken);
      setIsSignedIn(true);
    },
    []
  );

  const signOut = useCallback((reason?: string) => {
    console.log(
      `[Auth] signOut called${reason ? ` | reason=${reason}` : ''}`
    );

    setAccessToken(null);
    setRefreshToken(null);
    setIsSignedIn(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isSignedIn,
      accessToken,
      refreshToken,
      signIn,
      signOut,
    }),
    [isSignedIn, accessToken, refreshToken, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};