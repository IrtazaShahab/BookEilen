'use client';

import { useState } from 'react';
import BeHomeCarousel from './components/home-carousel';

export default function Index() {
    // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="bg-dark-900">
            <BeHomeCarousel />
        </div>
    );
}
