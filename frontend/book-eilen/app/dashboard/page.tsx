'use client';
import { useState } from 'react';
import { Carousel } from 'antd';
import { BookOpen, Search, User } from 'lucide-react'; // icons
import Image from 'next/image';
import BeHomeCarousel from '@/app/components/home-carousel';
import CarousalImage1 from '@/assets/images/horse-rider-img.webp';
import CarousalImage2 from '@/assets/images/man-in-rain.webp';
import CarousalImage3 from '@/assets/images/white-unicorn-with-pink-hair.webp';
import CarousalImage4 from '@/assets/images/traded-company-wall-street.webp';
import fantasy1 from '@/assets/images/fantasy-anime-style-scene.jpg';
import fictionBook from '@/assets/images/fiction-book.jpg';
import boyFantasy from '@/assets/images/boy-fantasy-world.jpg';
import romancebook from '@/assets/images/romance-book.jpg';

export default function Dashboard() {
    const [categories] = useState([
        { title: 'Fiction', books: [] },
        { title: 'Romance', books: [] },
        { title: 'Self Improvement', books: [] },
        { title: 'Fanfiction', books: [] },
    ]);

    return (
        <div className="min-h-screen pb-40 w-full bg-[#181818] text-white">
            {/* Carousel Ads */}
            <div className="relative w-full h-[400px] flex justify-center">
                {/* Carousel */}
                <Carousel autoplay className="w-full h-full">
                    {[CarousalImage1, CarousalImage2, CarousalImage3, CarousalImage4].map((img, i) => (
                        <div key={i} className="relative w-[800px] h-[400px]">
                            <Image src={img} alt={`Ad ${i + 1}`} fill className="object-cover" />
                        </div>
                    ))}
                </Carousel>

                {/* Overlay is OUTSIDE carousel now */}
                <div className="absolute bottom-10 left-10 z-20 text-white">
                    <h2 className="text-3xl font-bold">Discover New Stories</h2>
                    <button className="px-6 py-2 bg-[#e50914] font-medium rounded-lg be-login-btn">Explore</button>
                </div>
            </div>

            {/* Latest Books */}
            <section className="px-15 mt-30">
                <h2 className="text-xl font-bold mb-4">Latest Books</h2>
                <div className="flex gap-5 overflow-x-auto pb-4 cursor-pointer">
                    {[fantasy1, fictionBook, boyFantasy, romancebook, boyFantasy].map((src, i) => (
                        <Image
                            key={i}
                            src={src}
                            alt={`book-${i}`}
                            width={200}
                            height={220}
                            className="rounded-lg hover:scale-102 transition-transform curser-pointer"
                        />
                    ))}
                </div>
            </section>

            {/* Categories (Netflix style rows) */}
            {categories.map((cat, idx) => (
                <section key={idx} className="px-15 mt-30 ">
                    <h2 className="text-xl font-bold mb-4">{cat.title}</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {[fantasy1, fictionBook, boyFantasy, romancebook].map((src, i) => (
                            <Image
                                key={i}
                                src={src}
                                alt={`${cat.title}-${i}`}
                                width={180}
                                height={200}
                                className="rounded-lg hover:scale-102 transition-transform curser-pointer"
                            />
                        ))}
                        {[fantasy1, fictionBook, boyFantasy, romancebook].map((src, i) => (
                            <Image
                                key={i}
                                src={src}
                                alt={`${cat.title}-${i}`}
                                width={180}
                                height={200}
                                className="rounded-lg hover:scale-102 transition-transform curser-pointer"
                            />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
