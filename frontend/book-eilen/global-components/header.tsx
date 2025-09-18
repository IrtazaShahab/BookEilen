'use client';

import { Fragment, useState, useEffect, useRef } from 'react';
import { Popover, PopoverButton, PopoverGroup, PopoverPanel, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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

import Image from 'next/image';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hoverOpen, setHoverOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const searchRef = useRef(null);
    const buttonRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    // You can expand this with real book covers from your DB/API
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

    // Close if clicking outside input and outside button
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

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 576); // adjust breakpoint if needed
        };

        handleResize(); // check on mount
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMobile) {
            setHoverOpen(true); // always open on mobile
        } else {
            setHoverOpen(false); // reset for desktop
        }
    }, [isMobile]);

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
                                    {/* Browse Button */}
                                    <PopoverButton
                                        onClick={(h) => {
                                            h.preventDefault();
                                            router.push('/dashboard');
                                        }}
                                        className={`be-link flex items-center gap-1 ${hoverOpen ? 'active' : ''}`}
                                    >
                                        Browse
                                        {hoverOpen ? (
                                            <ChevronUpIcon className="transition-transform duration-200" width={20} height={20} />
                                        ) : (
                                            <ChevronDownIcon className="transition-transform duration-200" width={20} height={20} />
                                        )}
                                    </PopoverButton>

                                    {/* Dropdown Content */}
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
                                            className="absolute left-0 mt-2 w-[500px] be-dropdown-content bg-white shadow-xl rounded-xl"
                                        >
                                            <div className="flex p-4 be-list-content">
                                                {/* Category List */}
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

                                                {/* Image Preview */}
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
                        <a href="/pages/dashboard" className="be-link">
                            Features
                        </a>
                        <a href="#" className="be-link">
                            Community
                        </a>
                        <a href="#" className="be-link">
                            Blogs
                        </a>
                    </PopoverGroup>

                    {/* Right Content */}
                    <div className="be-right-content">
                        {/* Desktop Search */}
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

                        {/* be-profile-dropdown */}
                        <PopoverGroup className="be-profile-dropdown">
                            <Popover className="be-dropdown">
                                <PopoverButton className="be-link">
                                    <Image src={DropdownIcon} width="32" height="32" alt="dropdown" className="profile-img" />
                                    <h6 className="dropdown-username">Muaz Rehan</h6>
                                    <ChevronDownIcon aria-hidden="true" />
                                </PopoverButton>
                                <PopoverPanel className="be-dropdown-content">
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
                                                    <a href="#">
                                                        <Image src={LogoutIcon} width="24" height="24" alt="" />
                                                        Log Out
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </PopoverPanel>
                            </Popover>
                        </PopoverGroup>

                        <a href="#" className="be-login-btn be-link">
                            Log in
                        </a>

                        {/* Toggler button (Mobile only) */}
                        <div className="be-navbar-toggle d-block d-lg-none">
                            <button type="button" onClick={() => setMobileMenuOpen(true)} className="be-navbar-toggle-icon">
                                <Bars3Icon className="size-6" />
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Search Input (below nav) */}
                {isMobile && (
                    <div className={`mobile-search-wrapper ${mobileSearchOpen ? 'open' : ''}`}>
                        <div className="be-input be-mobile-input" ref={searchRef}>
                            <input
                                type="text"
                                placeholder="Search here"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="be-search-input"
                                autoFocus
                            />
                            <Image className="search-icon" src={SearchIcon} alt="search-icon" />
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                <div className={`be-navbar-mobile d-lg-none ${mobileMenuOpen ? 'show' : 'hide'}`}>
                    <div className="be-mobile-header">
                        <button type="button" onClick={() => setMobileMenuOpen(false)} className="mobile-close">
                            <XMarkIcon className="size-6" />
                        </button>
                    </div>

                    <div className="be-navbar-content">
                        {/* Nav Dropdown */}
                        <PopoverGroup className="be-nav-content">
                            <Popover className="be-dropdown">
                                {() => {
                                    const [open, setOpen] = useState(false);

                                    return (
                                        <div className="relative">
                                            {/* Click to toggle */}
                                            <PopoverButton
                                                onClick={() => setOpen((prev) => !prev)}
                                                className="be-link flex items-center gap-1"
                                            >
                                                Browse
                                                {open ? (
                                                    <ChevronUpIcon aria-hidden="true" width={20} height={20} />
                                                ) : (
                                                    <ChevronDownIcon aria-hidden="true" width={20} height={20} />
                                                )}
                                            </PopoverButton>

                                            <Transition
                                                as={Fragment}
                                                show={open}
                                                enter="transition ease-out duration-200"
                                                enterFrom="opacity-0 translate-y-2"
                                                enterTo="opacity-100 translate-y-0"
                                                leave="transition ease-in duration-150"
                                                leaveFrom="opacity-100 translate-y-0"
                                                leaveTo="opacity-0 translate-y-2"
                                            >
                                                <PopoverPanel static className="w-full be-dropdown-content rounded-md bg-white">
                                                    <div className="p-4 be-list-content">
                                                        <div className="be-list">
                                                            <ul>
                                                                <li>
                                                                    <a href="#">Romance</a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">Fan-Fiction</a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">Fantasy</a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">Historical Fic</a>
                                                                </li>
                                                            </ul>
                                                            <ul>
                                                                <li>
                                                                    <a href="#">Paranormal</a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">Mystery</a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">Poetry</a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">Adventure</a>
                                                                </li>
                                                            </ul>
                                                            <ul>
                                                                <li>
                                                                    <a href="#">Diverse Lit</a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">Editors Picks</a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">Non-Fiction</a>
                                                                </li>
                                                                <li>
                                                                    <a href="#">Short Fiction</a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </PopoverPanel>
                                            </Transition>
                                        </div>
                                    );
                                }}
                            </Popover>

                            <Link href="#" className="be-link">
                                Features
                            </Link>
                            <Link href="#" className="be-link">
                                Community
                            </Link>
                            <Link href="#" className="be-link">
                                Features
                            </Link>
                            <Link href="#" className="be-link">
                                Blogs
                            </Link>
                            <Link href="#" className="be-link">
                                Docs
                            </Link>
                        </PopoverGroup>
                    </div>
                </div>
            </div>
        </header>
    );
}
