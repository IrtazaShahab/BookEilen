// app/auth/google-callback/page.tsx
import { Suspense } from 'react';
import GoogleCallbackInner from './GoogleCallbackInner';

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0b0b] via-[#111] to-black">
        <div className="text-center">
          <svg className="animate-spin w-10 h-10 text-[#E20C11] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <p className="text-white/50 text-sm">Signing you in with Google...</p>
        </div>
      </div>
    }>
      <GoogleCallbackInner />
    </Suspense>
  );
}