'use client';
import { useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/global-components/header';
import Footer from '@/global-components/footer';
import { useAuth } from '@/app/contexts/authcontext';

interface AuthProps {
  children: React.ReactNode;
}

export default function Auth({ children }: AuthProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Keep this outside of render changes
  const publicRoutes = useMemo(
    () => ['/', '/auth/login-form', '/auth/signup-form', '/auth/forget-password'],
    []
  );

  // Track last token we sent to avoid re-posting every route change
  const lastSentTokenRef = useRef<string | null>(null);

  // Send session token when auth is available
  useEffect(() => {
    if (isLoading) return;
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token || lastSentTokenRef.current === token) return;

    lastSentTokenRef.current = token;
    fetch('http://localhost:3041/api/save-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    }).catch((err) => console.error('Error saving session:', err));
  }, [isLoading, isLoggedIn]);

  // 2) Redirects live in a separate effect, driven by auth + path
  useEffect(() => {
    if (isLoading) return;

    const onPublic = publicRoutes.includes(pathname);

    // If logged in and on a public page, go to dashboard
    if (isLoggedIn && onPublic) {
      router.replace('/dashboard');
      return;
    }

    // If NOT logged in and on a private page, go to login
    if (!isLoggedIn && !onPublic) {
      router.replace('/auth/login-form');
      return;
    }
  }, [isLoading, isLoggedIn, pathname, router, publicRoutes]);

  if (isLoading) {
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
