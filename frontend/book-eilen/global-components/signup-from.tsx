'use client';
import { useForm } from 'react-hook-form';

export default function BeSignupForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm();

    const password = watch('password'); // Watch the password field for comparison

    const onSubmit = async (event) => {
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        // debugger;
        console.log('Form submitted:', event);

        try {
            await fetch('http://localhost:3040/users/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });

            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form className="be-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="">
                <h1 className="h2">Sign Up</h1>

                <div className="row mt-4 g-3">
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

                    <div className="">
                        <label htmlFor="email" className="form-label">
                            Email address
                        </label>
                        <input
                            required
                            id="email"
                            // name="email"
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

                    <div className="">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            required
                            id="password"
                            // name="password"
                            type="password"
                            autoComplete="password"
                            className="form-control be-form-input"
                            placeholder="Password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                        />
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>

                    <div className="">
                        <label htmlFor="confirm-password" className="form-label">
                            Confirm Password
                        </label>
                        <input
                            required
                            id="confirm-password"
                            // name="confirm-password"
                            type="password"
                            autoComplete="password"
                            className="form-control be-form-input"
                            placeholder="Confirm Password"
                            {...register('confirmPassword', {
                                required: 'Confirm Password is required',
                                validate: (value) => value === password || 'Passwords do not match',
                            })}
                        />

                        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
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
