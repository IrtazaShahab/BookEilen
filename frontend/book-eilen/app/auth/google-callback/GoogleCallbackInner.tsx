'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/authcontext';

export default function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userRaw = searchParams.get('user');
    const error = searchParams.get('error');

    console.log('🔍 Google callback params:', { token: !!token, userRaw: !!userRaw, error });

    if (error) {
      console.error('Google login failed:', error);
      router.replace('/auth/login-form?error=google_failed');
      return;
    }

    if (token && userRaw) {
      try {
        const userProfile = JSON.parse(decodeURIComponent(userRaw));
        console.log('✅ Parsed userProfile:', userProfile);
        
        login(token);
        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        // Small delay to ensure auth state updates before navigating
        setTimeout(() => {
          router.replace('/dashboard');
        }, 100);
      } catch (e) {
        console.error('Failed to parse Google callback data:', e);
        router.replace('/auth/login-form?error=google_failed');
      }
    } else {
      console.warn('⚠️ No token or user in URL params — redirecting to login');
      router.replace('/auth/login-form');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0b0b] via-[#111] to-black">
      <div className="text-center">
        <svg className="animate-spin w-10 h-10 text-[#E20C11] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-white/50 text-sm">Signing you in with Google...</p>
      </div>
    </div>
  );
}