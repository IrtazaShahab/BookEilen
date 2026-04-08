'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import sampleCarouselImage from 'images/horse-rider-img.webp';
import secondCarousel from 'images/Dubai-home-img.webp';
import thirdCarousel from 'images/man-in-rain.webp';
import fourthCarousel from 'images/white-unicorn-with-pink-hair.webp';

export default function BeHomeCarousel() {
    const slides = [
        { src: sampleCarouselImage, alt: 'horse-rider-img' },
        { src: secondCarousel, alt: 'Dubai-home-img' },
        { src: thirdCarousel, alt: 'man-in-rain' },
        { src: fourthCarousel, alt: 'white-unicorn-with-pink-hair' },
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => window.clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="be-home-carousel">
            <div className="relative">
                <Image src={slides[index].src} width={1000} height={350} alt={slides[index].alt} priority />
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                    {slides.map((_, dotIndex) => (
                        <button
                            key={dotIndex}
                            type="button"
                            aria-label={`Go to slide ${dotIndex + 1}`}
                            onClick={() => setIndex(dotIndex)}
                            className={`h-2.5 w-2.5 rounded-full transition ${
                                dotIndex === index ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
