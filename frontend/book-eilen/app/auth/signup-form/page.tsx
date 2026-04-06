'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BeSignupForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm();

    const password = watch('password'); // Watch the password field for comparison

    const onSubmit = async (data) => {
        console.log('Form submitted:', data);

        // remove confirmPassword before sending to backend
        const { confirmPassword, ...formData } = data;

        try {
            const response = await fetch('http://localhost:3040/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData), //  only send f_name, l_name, email, password
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Signup failed:', errorData);
                alert(`Signup failed: ${errorData.message}`);
                return;
            }

            const result = await response.json();
            console.log('Signup successful:', result);

            // Optionally save token (if you want auto-login)
            if (result.accessToken) {
                localStorage.setItem('token', result.accessToken);
            }

            alert('Signup successful! Redirecting to login...');
            reset();

            // Redirect to login page
            router.push('/auth/login-form');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <main className="container-md">
            <div className="form-content">
                <form className="be-form" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <h1 className="h2">Sign Up</h1>
                        <div className="row mt-4 g-4">
                            <div className="col-md-6">
                                <label htmlFor="first-name" className="form-label">
                                    First name
                                </label>
                                <input
                                    required
                                    id="first-name"
                                    type="text"
                                    autoComplete="given-name"
                                    className="form-control be-form-input"
                                    placeholder="First Name"
                                    {...register('f_name', {
                                        required: 'First Name is required',
                                        pattern: {
                                            value: /^[A-Za-z]+$/i,
                                            message: 'First Name must contain only letters',
                                        },
                                    })}
                                />
                                {errors.f_name && <p className="text-danger">{errors.f_name.message}</p>}
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="last-name" className="form-label">
                                    Last name
                                </label>
                                <input
                                    required
                                    id="last-name"
                                    type="text"
                                    autoComplete="family-name"
                                    className="form-control be-form-input"
                                    placeholder="Last Name"
                                    {...register('l_name', {
                                        required: 'Last Name is required',
                                        pattern: {
                                            value: /^[A-Za-z]+$/i,
                                            message: 'Last Name must contain only letters',
                                        },
                                    })}
                                />
                                {errors.l_name && <p className="text-danger">{errors.l_name.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="form-label">
                                    Email address
                                </label>
                                <input
                                    required
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    className="form-control be-form-input"
                                    placeholder="Email Address"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                />
                                {errors.email && <p className="text-danger">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        required
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
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
                                        // Eye OFF SVG
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M17.94 17.94A10.5 10.5 0 0 1 12 19.5C7.305 19.5 3.135 16.305 1.5 12C2.366 9.825 3.84 7.95 5.76 6.6" />
                                            <path d="M22.5 12C21.678 14.16 20.208 16.02 18.27 17.37" />
                                            <path d="M1 1l22 22" />
                                        </svg>
                                    ) : (
                                        // Eye ON SVG
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                                </div>

                                {errors.password && <p className="text-danger">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="form-label">
                                    Confirm Password
                                </label>
                                <div style={{ position: 'relative'}}>
                                <input
                                    required
                                    id="confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    className={`form-control be-form-input ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder="Confirm Password"
                                    {...register('confirmPassword', {
                                        required: 'Confirm Password is required',
                                        validate: (value) =>
                                            value === password || 'Passwords do not match',
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
                                        //  Eye OFF SVG
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M17.94 17.94A10.5 10.5 0 0 1 12 19.5C7.305 19.5 3.135 16.305 1.5 12C2.366 9.825 3.84 7.95 5.76 6.6" />
                                            <path d="M22.5 12C21.678 14.16 20.208 16.02 18.27 17.37" />
                                            <path d="M1 1l22 22" />
                                        </svg>
                                    ) : (
                                        //  Eye ON SVG
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                                </div>
                                {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center gap-3 mt-10">
                        <button type="submit" className="be-btn be-btn-submit btn">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
