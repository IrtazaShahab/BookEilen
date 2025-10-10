'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/global-components/header';
import Footer from '@/global-components/footer';

interface AuthProps {
  children: React.ReactNode;
}

export default function Auth({ children }: AuthProps) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Keep this outside of render changes
  const publicRoutes = useMemo(() => ['/login', '/signup', '/forget-password'],  []);

  // Track last token we sent to avoid re-posting every route change
  const lastSentTokenRef = useRef<string | null>(null);

  // 1) One-time auth check on mount + cross-tab updates
  useEffect(() => {
    let cancelled = false;

    const checkAuth = () => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token'); // handle both keys if needed
      if (!cancelled) setIsLoggedIn(Boolean(token));

      // Send session only if token changed and exists
      if (token && lastSentTokenRef.current !== token) {
        lastSentTokenRef.current = token;
        fetch('http://localhost:3040/api/save-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // ✅ no quotes
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        }).catch((err) => console.error('Error saving session:', err));
      }
    };

    checkAuth();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'token') checkAuth();
    };
    window.addEventListener('storage', onStorage);

    // Mark ready after first check
    setIsReady(true);

    return () => {
      cancelled = true;
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // 2) Redirects live in a separate effect, driven by auth + path
  useEffect(() => {
    if (!isReady) return;

    const onPublic = publicRoutes.includes(pathname);

    // If logged in and on a public page, go to dashboard
    if (isLoggedIn && onPublic) {
      router.replace('/dashboard');
      return;
    }

    // If NOT logged in and on a private page, go to login
    if (!isLoggedIn && !onPublic) {
      router.replace('/login');
      return;
    }
  }, [isReady, isLoggedIn, pathname, router, publicRoutes]);

  if (!isReady) {
    return <p>Loading...</p>;
  }

  const isPublicPage = publicRoutes.includes(pathname);

  return (
    <>
      {isLoggedIn && !isPublicPage && <Header />}
      <main>{children}</main>
      {isLoggedIn && !isPublicPage && <Footer />}
    </>
  );
}
