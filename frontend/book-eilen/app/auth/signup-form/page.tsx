'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type SignupValues = {
    f_name: string;
    l_name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function BeSignupForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<SignupValues>();

    const password = watch('password');
    const passwordValue = watch('password');
    const confirmPasswordValue = watch('confirmPassword');

    const onSubmit = async (data: SignupValues) => {
        const { confirmPassword, ...formData } = data;
        try {
            const response = await fetch('http://localhost:3041/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Signup failed: ${errorData.message}`);
                return;
            }

            const result = await response.json();
            if (result.accessToken) {
                localStorage.setItem('token', result.accessToken);
            }

            alert('Signup successful! Redirecting to login...');
            reset();
            router.push('/auth/login-form');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const EyeOpen = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

    const EyeClosed = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

    const inputClass = (hasError: boolean) =>
        `w-full mt-2 px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border ${
            hasError ? 'border-red-500' : 'border-gray-700'
        } focus:outline-none focus:border-[#E20C11] focus:ring-2 focus:ring-[#E20C11]/20 transition`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0b0b] via-[#111] to-black px-4 py-10">

            {/* Card */}
            <div className="w-full max-w-xl bg-[#111] border border-white/5 rounded-2xl shadow-[0_0_40px_rgba(226,12,17,0.15)] p-8 relative">

                {/* Top Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#E20C11] rounded-t-2xl" />

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <p className="text-gray-400 mb-2 text-lg font-medium">Create your account on</p>
                        <h1 className="text-3xl font-bold text-white">
                            Book<span className="text-[#E20C11]">Eilen</span>
                        </h1>
                    </div>

                    {/* First & Last Name */}
                    <div className="flex gap-4 mb-5">
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">First Name</label>
                            <input
                                type="text"
                                autoComplete="given-name"
                                className={inputClass(!!errors.f_name)}
                                placeholder="First name"
                                {...register('f_name', {
                                    required: 'First name is required',
                                    pattern: {
                                        value: /^[A-Za-z]+$/i,
                                        message: 'Letters only',
                                    },
                                })}
                            />
                            {errors.f_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.f_name.message}</p>
                            )}
                        </div>

                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Last Name</label>
                            <input
                                type="text"
                                autoComplete="family-name"
                                className={inputClass(!!errors.l_name)}
                                placeholder="Last name"
                                {...register('l_name', {
                                    required: 'Last name is required',
                                    pattern: {
                                        value: /^[A-Za-z]+$/i,
                                        message: 'Letters only',
                                    },
                                })}
                            />
                            {errors.l_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.l_name.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-5">
                        <label className="text-sm text-gray-400">Email Address</label>
                        <input
                            type="email"
                            autoComplete="email"
                            className={inputClass(!!errors.email)}
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
                    <div className="mb-5">
                        <label className="text-sm text-gray-400">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                className={inputClass(!!errors.password)}
                                style={
                                    !showPassword && passwordValue
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
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeClosed /> : <EyeOpen />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-6">
                        <label className="text-sm text-gray-400">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                className={inputClass(!!errors.confirmPassword)}
                                style={
                                    !showConfirmPassword && confirmPasswordValue
                                        ? { fontSize: '1.4rem', letterSpacing: '0.18em', fontFamily: 'serif' }
                                        : {}
                                }
                                placeholder="Confirm your password"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value) => value === password || 'Passwords do not match',
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showConfirmPassword ? <EyeClosed /> : <EyeOpen />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-2 py-3 rounded-full bg-[#E20C11] text-white font-semibold hover:bg-red-600 transition hover:shadow-[0_6px_20px_rgba(226,12,17,0.4)] disabled:opacity-60"
                    >
                        {isSubmitting ? 'Creating account...' : 'Sign Up'}
                    </button>

                    {/* Login link */}
                    <p className="text-center text-gray-400 text-sm mt-6">
                        Already have an account?{' '}
                        <span
                            onClick={() => router.push('/auth/login-form')}
                            className="text-[#E20C11] cursor-pointer font-semibold"
                        >
                            Login
                        </span>
                    </p>

                </form>
            </div>
        </div>
    );
}