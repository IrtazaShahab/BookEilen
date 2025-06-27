'use client';

import React from 'react';
import { Carousel } from 'antd';

const contentStyle: React.CSSProperties = {
    margin: 0,
    // height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

export default function BeHomeCarousel() {
    return (
        <div className="be-home-carousel">
            <Carousel arrows infinite={false}>
                <div>
                    <img src="/frontend/book-eilen/assets/images/sample-carousel.jpg" alt="1" />
                </div>
                <div>
                    <img src="/frontend/book-eilen/assets/images/sample-carousel.jpg" alt="2" />
                </div>
                <div>
                    <img src="/frontend/book-eilen/assets/images/sample-carousel.jpg" alt="3" />
                </div>
                <div>
                    <img src="/frontend/book-eilen/assets/images/sample-carousel.jpg" alt="4" />
                </div>
            </Carousel>
        </div>
    );
}
