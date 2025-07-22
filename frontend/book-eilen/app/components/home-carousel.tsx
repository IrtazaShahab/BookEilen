'use client';

import React from 'react';
import { Carousel } from 'antd';
import Image from 'next/image';
import sampleCarouselImage from 'images/horse-rider-img.webp';
import secondCarousel from 'images/Dubai-home-img.webp';
import thirdCarousel from 'images/man-in-rain.webp';
import fourthCarousel from 'images/white-unicorn-with-pink-hair.webp';

export default function BeHomeCarousel() {
    return (
        <div className="be-home-carousel">
            <Carousel arrows infinite={false} autoplay autoplaySpeed={3000}>
                <div>
                    <Image src={sampleCarouselImage} width="1000" height="350" alt="horse-rider-img" />
                </div>
                <div>
                    <Image src={secondCarousel} width="1000" height="350" alt="Dubai-home-img" />
                </div>
                <div>
                    <Image src={thirdCarousel} width="1000" height="350" alt="man-in-rain" />
                </div>
                <div>
                    <Image src={fourthCarousel} width="1000" height="350" alt="white-unicorn-with-pink-hair" />
                </div>
            </Carousel>
        </div>
    );
}
