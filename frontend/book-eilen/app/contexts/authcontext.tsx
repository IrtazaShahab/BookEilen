'use client';
import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (authToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // ✅ Read token synchronously on first render — no false "logged out" flash
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(localStorage.getItem('authToken'));
  });

  // ✅ Start as false only on server, true on client means we already know auth state
  const [isLoading, setIsLoading] = useState<boolean>(
    typeof window === 'undefined' ? true : false
  );

  useEffect(() => {
    // Only needed for SSR hydration — on client we already read it synchronously
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(Boolean(token));
    setIsLoading(false);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        setIsLoggedIn(Boolean(e.newValue));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback((token: string) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn, isLoading, login, logout }),
    [isLoggedIn, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};