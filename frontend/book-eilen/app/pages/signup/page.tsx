'use client';

import React, { useEffect, memo } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { useRouter } from 'next/navigation';
import ReduxProvider from '@/app/ReduxProvider';
import BeSignupForm from '@/app/auth/signup-form/page';


const Signup = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
            router.push('/'); // Redirect to home if not authenticated
        }
    }, [router]);

    return (
        <main className="container-md">
            <div  className='form-content'>
                <BeSignupForm />
            </div>
        </main>
    );
};

export default memo(Signup);
