'use client';

import React from 'react';
import { Carousel } from 'antd';
import Image from 'next/image';
import sampleCarouselImage from 'images/sample-carousel.jpg';

export default function BeHomeCarousel() {
    return (
        <div className="be-home-carousel">
            <Carousel arrows infinite={false}>
                <div>
                    <Image src={sampleCarouselImage} width="1000" height="100" alt="1" />
                </div>
                <div>
                    <Image src={sampleCarouselImage} width="1000" height="100" alt="1" />
                </div>
                <div>
                    <Image src={sampleCarouselImage} width="1000" height="100" alt="1" />
                </div>
                <div>
                    <Image src={sampleCarouselImage} width="1000" height="100" alt="1" />
                </div>
            </Carousel>
        </div>
    );
}
