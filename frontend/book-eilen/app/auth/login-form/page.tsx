'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/authcontext';
import Link from 'next/link';

// ✅ Define form types
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
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const password = watch('password');

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const onSubmit: SubmitHandler<LoginFormInputs> = useCallback(
        async (data) => {
            try {
                const response = await fetch('http://localhost:3041/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const resData = await response.json();

                if (response.ok && resData.accessToken) {
                    login(resData.accessToken);
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0b0b] via-[#111] to-black px-4">

            {/* Card */}
            <div className="w-full max-w-xl bg-[#111] border border-white/5 rounded-2xl shadow-[0_0_40px_rgba(226,12,17,0.15)] p-8 relative">

                {/* Top Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#E20C11] rounded-t-2xl" />

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <p className="text-white-400 mb-2 text-lg font-medium">Welcome to </p>
                        <h1 className="text-3xl font-bold text-white">
                            Book<span className="text-[#E20C11]">Eilen</span>
                        </h1>

                    </div>

                    {/* Email */}
                    <div className="mb-5">
                        <label className="text-sm font-medium text-white-400">Email Address</label>
                        <input
                            type="email"
                            className={`w-full mt-2 px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border ${errors.email ? 'border-red-500' : 'border-gray-700'
                                } focus:outline-none focus:border-[#E20C11] focus:ring-2 focus:ring-[#E20C11]/20 transition`}
                            placeholder="Enter your email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Invalid email',
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label className="text-sm font-medium text-white-400">Password</label>

                        <div className="relative mt-2">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`w-full px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border ${errors.password ? 'border-red-500' : 'border-gray-700'
                                    } focus:outline-none focus:border-[#E20C11] focus:ring-2 focus:ring-[#E20C11]/20 transition`}
                                style={
                                    !showPassword && password // apply only when hidden and has value
                                        ? { fontSize: '1.4rem', letterSpacing: '0.18em', fontFamily: 'serif' }
                                        : {}
                                }
                                placeholder="Enter your password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Min 6 characters',
                                    },
                                })} />

                            {/* Toggle */}
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-4 py-3 rounded-full bg-[#E20C11] text-white font-semibold hover:bg-red-600 transition hover:shadow-[0_6px_20px_rgba(226,12,17,0.4)] disabled:opacity-60"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>

                    {/* Links */}
                    <div className="text-center mt-6 space-y-3">
                        <Link
                            href="/auth/forget-password"
                            className="block font-semibold text-white-400 hover:text-[#E20C11] text-sm"
                        >
                            Forgot Password?
                        </Link>

                        <p className="text-gray-400 text-sm">
                            Don’t have an account?{' '}
                            <span
                                onClick={() => router.push('/auth/signup-form')}
                                className="text-[#E20C11] cursor-pointer font-semibold text-sm"
                            >
                                Sign up
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}