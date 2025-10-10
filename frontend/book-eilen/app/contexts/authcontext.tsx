// AuthContext.tsx (patched)
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // guard against React 18 Strict Mode double-invoke in DEV
    let cancelled = false;

    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (!cancelled) setIsLoggedIn(!!token);
      if (!cancelled) setIsLoading(false);
    };

    checkAuth();
    const onStorage = () => checkAuth();
    window.addEventListener('storage', onStorage);

    return () => {
      cancelled = true;
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const login = useCallback((token: string) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  }, []);

  // 👇 memoize the value so its identity is stable across renders
  const value = useMemo(() => ({ isLoggedIn, isLoading, login, logout }), [isLoggedIn, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
