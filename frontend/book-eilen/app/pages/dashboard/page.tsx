'use client';

import React, { useEffect, memo } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { useRouter } from 'next/navigation';
import ReduxProvider from '@/app/ReduxProvider';

const DashboardPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
            router.push('/'); // Redirect to home if not authenticated
        }
    }, [router]);

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <section>
                <p>Welcome to your dashboard! Here you can view your stats and manage your account.</p>
                {/* Add dashboard widgets/components here */}
            </section>
        </main>
    );
};

export default memo(DashboardPage);
