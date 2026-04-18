'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/authcontext';
import Link from 'next/link';

type LoginFormInputs = {
    email: string;
    password: string;
};

export default function BeLoginForm() {
    const router = useRouter();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        defaultValues: { email: '', password: '' },
    });

    const password = watch('password');
    const [showPassword, setShowPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const onSubmit: SubmitHandler<LoginFormInputs> = useCallback(
        async (data) => {
            try {
                const response = await fetch('http://localhost:3041/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const resData = await response.json();
                if (response.ok && resData.accessToken) {
                    login(resData.accessToken);
                    if (resData.data) localStorage.setItem('userProfile', JSON.stringify(resData.data));
                    router.push('/dashboard');
                } else {
                    alert(resData.message || 'Login failed.');
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        },
        [login, router]
    );

    // ✅ Google OAuth — redirects to backend which redirects to Google
    const handleGoogleLogin = () => {
        setGoogleLoading(true);
        window.location.href = 'http://localhost:3041/users/auth/google';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0b0b] via-[#111] to-black px-4">
            <div className="w-full max-w-xl bg-[#111] border border-white/5 rounded-2xl shadow-[0_0_40px_rgba(226,12,17,0.15)] p-8 relative">

                {/* Top Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#E20C11] rounded-t-2xl" />

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <p className="text-white/60 mb-2 text-lg font-medium">Welcome to</p>
                        <h1 className="text-3xl font-bold text-white">
                            Book<span className="text-[#E20C11]">Eilen</span>
                        </h1>
                    </div>

                    {/* ✅ Google Login Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-white text-gray-800 font-semibold hover:bg-gray-100 transition disabled:opacity-60 mb-6"
                    >
                        {googleLoading ? (
                            <svg className="animate-spin w-5 h-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                        ) : (
                            // Google "G" SVG logo
                            <svg width="20" height="20" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.1-6.1C34.46 3.39 29.5 1.5 24 1.5 14.93 1.5 7.19 6.96 3.63 14.64l7.12 5.53C12.4 13.85 17.72 9.5 24 9.5z"/>
                                <path fill="#4285F4" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.42c-.54 2.9-2.18 5.36-4.64 7.02l7.12 5.53C43.18 37.36 46.1 31.36 46.1 24.5z"/>
                                <path fill="#FBBC05" d="M10.75 28.17A14.5 14.5 0 0 1 9.5 24c0-1.45.25-2.85.69-4.17l-7.12-5.53A22.44 22.44 0 0 0 1.5 24c0 3.61.86 7.03 2.38 10.06l6.87-5.89z"/>
                                <path fill="#34A853" d="M24 46.5c5.5 0 10.12-1.82 13.5-4.95l-7.12-5.53C28.6 37.8 26.42 38.5 24 38.5c-6.28 0-11.6-4.35-13.25-10.17l-6.87 5.89C7.19 41.04 14.93 46.5 24 46.5z"/>
                            </svg>
                        )}
                        {googleLoading ? 'Redirecting...' : 'Continue with Google'}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-white/30 text-xs font-medium">or sign in with email</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Email */}
                    <div className="mb-5">
                        <label className="text-sm font-medium text-white/60">Email Address</label>
                        <input
                            type="email"
                            className={`w-full mt-2 px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border ${
                                errors.email ? 'border-red-500' : 'border-gray-700'
                            } focus:outline-none focus:border-[#E20C11] focus:ring-2 focus:ring-[#E20C11]/20 transition`}
                            placeholder="Enter your email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                            })}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label className="text-sm font-medium text-white/60">Password</label>
                        <div className="relative mt-2">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border ${
                                    errors.password ? 'border-red-500' : 'border-gray-700'
                                } focus:outline-none focus:border-[#E20C11] focus:ring-2 focus:ring-[#E20C11]/20 transition`}
                                style={
                                    !showPassword && password
                                        ? { fontSize: '1.4rem', letterSpacing: '0.18em', fontFamily: 'serif' }
                                        : {}
                                }
                                placeholder="Enter your password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Min 6 characters' },
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-2 py-3 rounded-full bg-[#E20C11] text-white font-semibold hover:bg-red-600 transition hover:shadow-[0_6px_20px_rgba(226,12,17,0.4)] disabled:opacity-60"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>

                    {/* Links */}
                    <div className="text-center mt-6 space-y-3">
                        <Link href="/auth/forget-password" className="block font-semibold text-white/50 hover:text-[#E20C11] text-sm transition">
                            Forgot Password?
                        </Link>
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <span onClick={() => router.push('/auth/signup-form')} className="text-[#E20C11] cursor-pointer font-semibold text-sm">
                                Sign up
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}