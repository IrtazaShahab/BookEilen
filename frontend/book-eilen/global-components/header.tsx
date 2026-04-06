'use client';

import { Fragment, useState, useEffect, useRef } from 'react';
import { Popover, PopoverButton, PopoverGroup, PopoverPanel, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/app/contexts/authcontext';

// --- your existing image imports ---
import SearchIcon from 'images/search-icon.svg';
import DropdownIcon from 'images/dropdown-icon.svg';
import LogoutIcon from 'images/log-out.svg';
import SettingsIcon from 'images/settings-icon.svg';
import ReadListIcon from 'images/read-list.svg';
import MyBooksIcon from 'images/open-book.svg';
import PersonIcon from 'images/person.svg';
import BookEilen from 'images/BookEilen.png';
import romanceBook from 'images/romance-book.jpg';
import fictionBook from 'images/fiction-book.jpg';
import fantasyBook from 'images/boy-fantasy-world.jpg';
import historyBook from 'images/history.jpg';
import humour from 'images/humour.jpg';
import sciFi from 'images/open-book-with-fairytale-scene.jpg';
import poetry from 'images/poetry.jpg';
import editorsPick from 'images/group-grover.png';
import thriller from 'images/horse-rider-img.webp';
import DropdownBook from 'images/fiction-book.jpg';
import horror from 'images/horrer.jpg';
import mystry from 'images/man-in-rain.webp';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hoverOpen, setHoverOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // 👇 USE AUTH CONTEXT INSTEAD OF LOCAL STATE
    const { isLoggedIn, logout } = useAuth();

    const searchRef = useRef(null);
    const buttonRef = useRef(null);
    const router = useRouter();

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    // Close search if clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setMobileSearchOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Detect mobile
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 576);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setHoverOpen(isMobile);
    }, [isMobile]);

    // Book categories
    const categories = [
        { name: 'Romance', image: romanceBook },
        { name: 'Fan-Fiction', image: fictionBook },
        { name: 'Fantasy', image: fantasyBook },
        { name: 'Historical Fic', image: historyBook },
        { name: 'Humor', image: humour },
        { name: 'Sci-Fi', image: sciFi },
        { name: 'Paranormal', image: horror },
        { name: 'Mystry', image: mystry },
        { name: 'Poetry', image: poetry },
        { name: 'Adventure', image: fantasyBook },
        { name: 'Thriller', image: thriller },
        { name: 'Teen Fiction', image: romanceBook },
        { name: 'Diverse Lit', image: poetry },
        { name: 'Editors Picks', image: editorsPick },
        { name: 'Non-Fiction', image: fictionBook },
        { name: 'Short Fiction', image: fictionBook },
    ];

    // 👇 LOGOUT HANDLER USING CONTEXT
    const handleLogout = () => {
        logout(); // Clear auth state from context
        router.push('/auth/login-form');
    };

    return (
        <header className="be-header">
            <div className="shadow-xl">
                <nav aria-label="Global" className="be-nav">
                    {/* Logo */}
                    <div className="be-logo">
                        <Link href="/" className="be-link">
                            <Image alt="Logo-Image" src={BookEilen} width="158" height="38" />
                        </Link>
                    </div>

                    {/* Nav Dropdown */}
                    <PopoverGroup className="be-nav-content">
                        {/* Browse dropdown */}
                        <Popover className="be-dropdown">
                            {({ open }) => (
                                <div
                                    className="relative"
                                    onMouseEnter={() => setHoverOpen(true)}
                                    onMouseLeave={() => {
                                        setHoverOpen(false);
                                        setSelectedCategory(null);
                                    }}
                                >
                                    <PopoverButton
                                        onClick={(h) => {
                                            h.preventDefault();
                                            router.push('/dashboard');
                                        }}
                                        className={`be-link flex items-center gap-1 ${hoverOpen ? 'active' : ''}`}
                                    >
                                        Browse
                                        {hoverOpen ? (
                                            <ChevronUpIcon width={20} height={20} />
                                        ) : (
                                            <ChevronDownIcon width={20} height={20} />
                                        )}
                                    </PopoverButton>

                                    <Transition
                                        as={Fragment}
                                        show={hoverOpen}
                                        enter="transition ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-3 scale-95"
                                        enterTo="opacity-100 translate-y-0 scale-100"
                                        leave="transition ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 scale-100"
                                        leaveTo="opacity-0 translate-y-3 scale-95"
                                    >
                                        <PopoverPanel
                                            static
                                            className="absolute mt-[10px] left-0 w-[500px] be-dropdown-content bg-white shadow-xl rounded-xl"
                                        >
                                            <div className="flex p-4 be-list-content">
                                                <div className="grid grid-cols-3 w-2/3">
                                                    {categories.map((cat) => (
                                                        <button
                                                            key={cat.name}
                                                            className={`text-left transition font-normal ${
                                                                selectedCategory?.name === cat.name ? 'font-semibold' : ''
                                                            }`}
                                                            onMouseEnter={() => setSelectedCategory(cat)}
                                                        >
                                                            {cat.name}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="flex-1 flex justify-center items-center">
                                                    <AnimatePresence mode="wait">
                                                        <motion.div
                                                            key={selectedCategory?.name || 'default'}
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="w-48 h-60 rounded-lg overflow-hidden shadow-md"
                                                        >
                                                            <Image
                                                                src={selectedCategory?.image || DropdownBook}
                                                                alt={selectedCategory?.name || 'Default'}
                                                                width={260}
                                                                height={260}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </motion.div>
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </PopoverPanel>
                                    </Transition>
                                </div>
                            )}
                        </Popover>

                        {/* Other Links */}
                        <a href="/pages/dashboard" className="be-link">Features</a>
                        <a href="#" className="be-link">Community</a>
                        <a href="#" className="be-link">Blogs</a>
                    </PopoverGroup>

                    {/* Right Section */}
                    <div className="be-right-content">
                        {/* Search (Desktop) */}
                        {!isMobile && (
                            <div className="be-input" ref={searchRef}>
                                <input
                                    type="text"
                                    placeholder="Search here"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="be-search-input"
                                />
                                <Image className="search-icon" src={SearchIcon} alt="search-icon" />
                            </div>
                        )}

                        {/* Search (Mobile) */}
                        {isMobile && (
                            <button
                                type="button"
                                onClick={() => setMobileSearchOpen((prev) => !prev)}
                                ref={buttonRef}
                                className="search-toggle-btn"
                            >
                                <Image className="search-icon-outside" src={SearchIcon} width={25} height={25} alt="search-icon" />
                            </button>
                        )}

                        {/* 👇 SHOW PROFILE DROPDOWN ONLY IF LOGGED IN */}
                        {isLoggedIn ? (
                            <PopoverGroup className="be-profile-dropdown">
                                <Popover className="be-dropdown">
                                    {() => (
                                        <div
                                            className="relative"
                                            onMouseEnter={() => setDropdownOpen(true)}
                                            onMouseLeave={() => setDropdownOpen(false)}
                                        >
                                            <a
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.push('/profile');
                                                }}
                                                className={`be-link flex items-center cursor-pointer ${dropdownOpen ? 'active' : ''}`}
                                            >
                                                <Image src={DropdownIcon} width="32" height="32" alt="dropdown" className="profile-img" />
                                                {dropdownOpen ? (
                                                    <ChevronUpIcon width={20} height={20} />
                                                ) : (
                                                    <ChevronDownIcon width={20} height={20} />
                                                )}
                                            </a>

                                            <Transition
                                                as={Fragment}
                                                show={dropdownOpen}
                                                enter="transition ease-out duration-300"
                                                enterFrom="opacity-0 translate-y-3 scale-95"
                                                enterTo="opacity-100 translate-y-0 scale-100"
                                                leave="transition ease-in duration-200"
                                                leaveFrom="opacity-100 translate-y-0 scale-100"
                                                leaveTo="opacity-0 translate-y-3 scale-95"
                                            >
                                                <PopoverPanel static className="absolute top-60 left-50 be-dropdown-content shadow-xl rounded-xl">
                                                    <div className="p-4 be-list-content">
                                                        <h5 className="font-semibold">
                                                            <Image src={PersonIcon} width="30" height="30" alt="person-icon" /> My Profile
                                                        </h5>
                                                        <div className="be-list">
                                                            <ul>
                                                                <li>
                                                                    <a href="#">
                                                                        <Image src={MyBooksIcon} width="22" height="22" alt="" />
                                                                        My Books
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">
                                                                        <Image src={ReadListIcon} width="24" height="24" alt="" />
                                                                        Read List
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">
                                                                        <Image src={SettingsIcon} width="24" height="24" alt="" />
                                                                        Settings
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a onClick={handleLogout} className="cursor-pointer">
                                                                        <Image src={LogoutIcon} width="24" height="24" alt="" />
                                                                        Log Out
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </PopoverPanel>
                                            </Transition>
                                        </div>
                                    )}
                                </Popover>
                            </PopoverGroup>
                        ) : (
                            // 👇 SHOW LOGIN BUTTON WHEN NOT LOGGED IN
                            <Link href="/auth/login-form" className="be-login-btn be-link">
                                Log in
                            </Link>
                        )}

                        {/* Mobile Menu Toggler */}
                        <div className="be-navbar-toggle d-block d-lg-none">
                            <button type="button" onClick={() => setMobileMenuOpen(true)} className="be-navbar-toggle-icon">
                                <Bars3Icon className="size-6" />
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Search Input */}
                {mobileSearchOpen && (
                    <div className="mobile-search-container" ref={searchRef}>
                        <input
                            type="text"
                            placeholder="Search here"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="be-search-input mobile"
                        />
                        <Image className="search-icon" src={SearchIcon} alt="search-icon" />
                    </div>
                )}
            </div>
        </header>
    );
}