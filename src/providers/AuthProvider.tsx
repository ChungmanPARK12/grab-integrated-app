// Root/src/providers/AuthProvider.tsx
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
  signIn: (reason?: string) => void;
  signOut: (reason?: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Log whenever auth state changes (single source of truth)
  useEffect(() => {
    console.log(`[Auth] state changed -> isSignedIn=${isSignedIn}`);
  }, [isSignedIn]);

  // Log when signIn/signOut is called (who/why)
  const signIn = useCallback((reason?: string) => {
    console.log(`[Auth] signIn called${reason ? ` | reason=${reason}` : ''}`);
    setIsSignedIn(true);
  }, []);

  const signOut = useCallback((reason?: string) => {
    console.log(`[Auth] signOut called${reason ? ` | reason=${reason}` : ''}`);
    setIsSignedIn(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isSignedIn,
      signIn,
      signOut,
    }),
    [isSignedIn, signIn, signOut]
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
