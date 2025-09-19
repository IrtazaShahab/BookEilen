'use client';
import { useState } from 'react';
import Image from 'next/image';
import CarousalImage1 from '@/assets/images/horse-rider-img.webp';

export default function Dashboard() {
    return (
        <div className="min-h-screen pb-40 w-full text-white">
            <Image className="myImage" src={CarousalImage1} width={400} height={500} alt="myRider" />
        </div>
    );
}
