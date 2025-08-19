'use client';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { setUser } from '../../redux/store';
import { useRouter } from 'next/navigation';

export default function BeLoginForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const dispatch = useAppDispatch();

    const onSubmit = useCallback(
        async (event: { email: string; password: string }) => {
            try {
                const response = await fetch('http://localhost:3040/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(event),
                });

                const data = await response.json();

                if (response.ok && data.accessToken) {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('accessToken', data.accessToken);
                    }

                    dispatch(setUser({ user: data.data, token: data.accessToken }));
                    router.push('/pages/dashboard');
                } else {
                    alert(data.message || 'Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        },
        [dispatch, router]
    );

    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, []);

    return (
        <form className="be-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="">
                <h1 className="h1 mb-5">Welcome To Book<span>Eilen</span></h1>
                <h1 className="h2">Login</h1>

                <div className="row mt-4 g-4">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>
                        <input
                            ref={emailRef}
                            id="email"
                            type="email"
                            autoComplete="email"
                            className={`form-control be-form-input ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="Email Address"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-danger small mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                className={`form-control be-form-input ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="Password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                            />
                            <button
  type="button"
  onClick={togglePasswordVisibility}
  style={{
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  }}
  aria-label="Toggle password visibility"
>
  {showPassword ? (
    // 👁️ Eye OFF SVG
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.5 10.5 0 0 1 12 19.5C7.305 19.5 3.135 16.305 1.5 12C2.366 9.825 3.84 7.95 5.76 6.6" />
      <path d="M22.5 12C21.678 14.16 20.208 16.02 18.27 17.37" />
      <path d="M1 1l22 22" />
    </svg>
  ) : (
    // 👁️ Eye ON SVG
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )}
</button>

                        </div>
                        {errors.password && (
                            <p className="text-danger small mt-1">{errors.password.message}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center gap-3 mt-5">
                <button type="submit" className="be-btn be-btn-submit btn btn-primary">
                    Submit
                </button>
            </div>

            {/* Sign up link */}
            <div className="text-center mt-3 sign-up-link">
                <p>
                    Don’t have an account?{' '}
                    <button
                      type="button"
                      className="btn btn-link text-primary fw-semibold"
                      onClick={() => router.push('/auth/signup-form')}
                      >
                       Sign up
                    </button>
                </p>
            </div>
        </form>
    );
}
