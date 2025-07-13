'use client';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppDispatch } from '../app/redux/hooks';
import { setUser } from '../app/redux/store';
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
    const emailRef = useRef(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const dispatch = useAppDispatch();

    const onSubmit = useCallback(async (event) => {
        //Check if the user exists and password is correct then login the user else put error message
        try {
            const response = await fetch('http://localhost:3040/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
            });

            const data = await response.json();
            if (response.ok && data.accessToken) {
                console.log(data.data);

                dispatch(setUser({ user: data.data, token: data.accessToken }));

                // Store accessToken in sessionStorage
                sessionStorage.setItem('accessToken', data.accessToken);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }, []);

    useEffect(() => {
        // REDIRECT TO Dashboard by UseRouter
        // window.location.href = '/';
        // window.location.href = '/pages/dashboard';
        console.log('Access Token', sessionStorage.getItem('accessToken'));

        if (!sessionStorage.getItem('accessToken')) {
            // router.push('/login');
            return;
        }
        router.push('/pages/dashboard');
    }, [router]);

    useEffect(() => {
        // Focus on the email input when the component mounts
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, []);

    return (
        <form className="be-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="">
                <h1 className="h2">Login</h1>

                <div className="row mt-4 g-3">
                    <div className="">
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
                    </div>

                    <div className="">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                required
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="password"
                                className="form-control be-form-input"
                                placeholder="Password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password is incorrect',
                                    },
                                })}
                            />
                            <button
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {showPassword ? 'Hide' : 'Show'} {/* Placeholder for icon */}
                            </button>
                        </div>
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center gap-3 mt-10">
                <button type="submit" className="be-btn be-btn-submit btn">
                    Submit
                </button>
            </div>
        </form>
    );
}
