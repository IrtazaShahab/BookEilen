'use client';

import Image from 'next/image';
import BookEilen from 'images/logo-img.png';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="text-gray-300 bg-[#000000]">
            <div className="mx-auto bg-[#282828] mb-[20px] rounded-[25px] max-w-7xl px-4 py-12 md:px-8">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <Link className="mb-3" href="/">
                            <Image src={BookEilen} alt="Logo-img" width={150} height={32} />
                        </Link>
                        <p className="mt-4 max-w-md text-sm text-white">
                            Bookeilen is an open, editable library catalog, building towards a web page for every book ever published.
                        </p>
                    </div>

                    <div>
                        <h5 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Explore</h5>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white">Genre</a></li>
                            <li><a href="#" className="hover:text-white">About Us</a></li>
                            <li><a href="#" className="hover:text-white">Our Bookstore</a></li>
                            <li><a href="#" className="hover:text-white">Shipping & Delivery</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Help</h5>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white">Placing an Order</a></li>
                            <li><a href="#" className="hover:text-white">Payment</a></li>
                            <li><a href="#" className="hover:text-white">Packing and Shipping</a></li>
                            <li><a href="#" className="hover:text-white">Tracking Orders</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Contact</h5>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="tel:+4733378901" className="hover:text-white">+4733378901</a></li>
                            <li><a href="mailto:bookeilen@gmail.com" className="hover:text-white">bookeilen@gmail.com</a></li>
                            <li>All System Operational</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-sm text-gray-500 md:flex-row md:items-center">
                    <span>© 2025 BookEilen. All Rights Reserved.</span>
                    <div className="flex gap-5">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms & Conditions</a>
                        <a href="#" className="hover:text-white">Cookies Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
