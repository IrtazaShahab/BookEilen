'use client';

import React, { useEffect, memo } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { useRouter } from 'next/navigation';
import ReduxProvider from '@/app/ReduxProvider';
import BeHomeCarousel from '@/app/components/home-carousel';
import Image from 'next/image';
import sampleCarouselImage from 'images/sample-carousel.jpg';
import featureCarouselImage from 'images/group-grover.png';
import featureCarouselSecond from 'images/shooting-arrow.png';
import featureCarouselThird from 'images/crypto.png';
import featureCarouselFourth from 'images/traded-company-wall-street.webp';
import featureCarouselFifth from 'images/white-unicorn-with-pink-hair.webp';



const DashboardPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
            router.push('/'); // Redirect to home if not authenticated
        }
    }, [router]);

    return (
        <main className="container-md">

            <div className="dashboard-page">
            <h1>Dashboard</h1>
                <BeHomeCarousel />
            <section className="bottom-section">
                <h2>Featured</h2>
                <div className="carousel row">
                    <div className="book-card col-lg-3 col-xl-2">
                        <Image src={featureCarouselImage} alt="Featured Book" />
                    </div>
                    <div className="book-card col-lg-3 col-xl-2">
                        <Image src={featureCarouselSecond} alt="Featured Book" />
                    </div>
                    <div className="book-card col-lg-3 col-xl-2">
                        <Image src={featureCarouselThird} alt="Featured Book" />
                    </div>
                    <div className="book-card col-lg-3 col-xl-2">
                        <Image src={featureCarouselFourth} alt="Featured Book" />
                    </div>
                    <div className="book-card col-lg-3 col-xl-2">
                        <Image src={featureCarouselFifth} alt="Featured Book" />
                    </div>
                </div>

                <h2>Top picks</h2>
                <div className="carousel col-lg-3 col-xl-2">
                    <div className="book-card">
                        <Image src={sampleCarouselImage} alt="Top Pick Book" />
                    </div>
                </div>

                <h2>Trending</h2>
                <div className="carousel col-lg-3 col-xl-2">
                    <div className="book-card">
                        <Image src={sampleCarouselImage} alt="Trending Book" />
                    </div>
                </div>
                <h2>New Arrivals</h2>
                <div className="carousel col-lg-3 col-xl-2">
                    <div className="book-card">
                        <Image src={sampleCarouselImage} alt="New Arrival Book" />
                    </div>
                </div>
                <h2>Most Popular</h2>
                <div className="carousel col-lg-3 col-xl-2">
                    <div className="book-card">
                        <Image src={sampleCarouselImage} alt="Most Popular Book" />
                    </div>
                </div>
                <h2>Recommendations</h2>
                <div className="carousel col-lg-3 col-xl-2">
                    <div className="book-card">
                        <Image src={sampleCarouselImage} alt="Recommended Book" />
                    </div>
                </div>
            </section>
            </div>
        </main>
    );
};

export default memo(DashboardPage);
