'use client';

import { useState } from 'react';
import BeHomeCarousel from './components/home-carousel';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Index() {
    // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="be-home">
            <BeHomeCarousel />
        </div>
    );
}
