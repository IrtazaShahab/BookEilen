'use client';

// import { useState } from 'react';
import BeHomeCarousel from '@/app/components/home-carousel';
import 'antd/dist/reset.css';

export default function Index() {
    // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="be-home">
            <BeHomeCarousel />
        </div>
    );
}
