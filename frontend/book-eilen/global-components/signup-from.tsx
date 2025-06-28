'use client';

import { ChevronDownIcon } from '@heroicons/react/16/solid';

export default function BeSignupForm() {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        console.log('Form submitted:', data);

        try {
            await fetch('http://localhost:302/api/bookcall', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form className="be-form" onSubmit={handleSubmit}>
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
                            name="first-name"
                            type="text"
                            autoComplete="given-name"
                            className="form-control be-form-input"
                            placeholder="First Name"
                        />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="last-name" className="form-label">
                            Last name
                        </label>
                        <input
                            id="last-name"
                            name="last-name"
                            type="text"
                            autoComplete="family-name"
                            className="form-control be-form-input"
                            placeholder="Last Name"
                        />
                    </div>

                    <div className="">
                        <label htmlFor="email" className="form-label">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="form-control be-form-input"
                            placeholder="Email Address"
                        />
                    </div>

                    <div className="">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="password"
                            className="form-control be-form-input"
                            placeholder="Password"
                        />
                    </div>

                    <div className="">
                        <label htmlFor="confirm-password" className="form-label">
                            Confirm Password
                        </label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autoComplete="password"
                            className="form-control be-form-input"
                            placeholder="Confirm Password"
                        />
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
