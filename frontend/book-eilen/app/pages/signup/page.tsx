'use client';

import { useState } from 'react';
import BeSignupForm from '@/global-components/signup-from';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';



export default function SignUp({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="form-content">
             <BeSignupForm />
        </div>
    );
}
