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
        <header className="be-header border-b border-white/[0.06] sticky top-0 z-50">
            <div className="shadow-xl bg-[#1B1B1B]">
                <nav aria-label="Global" className="be-nav bg-[#282828] flex items-center gap-8 px-10 h-16 max-w-[1440px] mx-auto rounded-[20px]">
                    {/* Logo */}
                    <div className="be-logo">
                        <Link href="/" className="be-link">
                            <Image alt="Logo-Image" src={BookEilen} width="158" height="38" />
                        </Link>
                    </div>

                        {/* Nav Links */}
        <div className="flex items-center gap-1 flex-1">

          {/* Browse Dropdown */}
          <div
            ref={browseRef}
            className="relative"
            onMouseEnter={() => setBrowseOpen(true)}
            onMouseLeave={() => setBrowseOpen(false)}
          >
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.07] transition-all"
            >
              Browse
              <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${browseOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {browseOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-[calc(100%+8px)] left-0 w-[500px] bg-[#141414] border border-white/[0.08] rounded-xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
                >
                  <div className="flex gap-5">
                    {/* Category grid */}
                    <div className="grid grid-cols-3 gap-0.5 flex-1">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.name}
                          onMouseEnter={() => setSelectedCat(cat)}
                          className={`text-left px-2.5 py-1.5 rounded-md text-[13px] transition-all
                            ${selectedCat.name === cat.name
                              ? 'text-[#E20C11] bg-white/[0.07] font-medium'
                              : 'text-gray-400 hover:text-white hover:bg-white/[0.07]'
                            }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>

                    {/* Preview card */}
                    <div className="w-[140px] shrink-0">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={selectedCat.name}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={`h-[190px] rounded-lg bg-gradient-to-br ${selectedCat.bg} flex flex-col items-center justify-center gap-2`}
                        >
                          <span className="text-4xl opacity-70">{selectedCat.icon}</span>
                          <span className="font-['Bebas_Neue'] text-white text-lg tracking-widest">{selectedCat.name}</span>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.07] transition-all" href="#">Features</a>
          <a className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.07] transition-all" href="#">Community</a>
          <a className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.07] transition-all" href="#">Blogs</a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Search */}
          <div className="flex items-center gap-2 bg-white/[0.07] border border-white/[0.08] rounded-full px-4 h-9 focus-within:border-white/25 focus-within:bg-white/10 transition-all">
            <svg className="w-3.5 h-3.5 stroke-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books..."
              className="bg-transparent text-white text-[13px] outline-none w-36 placeholder:text-gray-500"
            />
          </div>

          {/* Logged out */}
          {!isLoggedIn && (
            <Link
              href="/auth/login-form"
              className="bg-[#E20C11] hover:bg-[#ff1a1f] text-white text-[13px] font-semibold px-5 h-9 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Log in
            </Link>
          )}

          {/* Logged in */}
          {isLoggedIn && (
            <div
              ref={profileRef}
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button className="w-9 h-9 rounded-full bg-[#E20C11] border-2 border-white/15 hover:border-white/40 transition-all flex items-center justify-center text-white text-xs font-semibold">
                MR
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-[calc(100%+8px)] right-0 w-52 bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
                  >
                    {/* Profile header */}
                    <div className="px-4 py-3 border-b border-white/[0.08]">
                      <p className="text-white text-sm font-semibold">Muaz Rehan</p>
                      <p className="text-gray-500 text-xs mt-0.5">muaz@bookeilen.com</p>
                    </div>
                    <div className="p-2">
                      {[
                        { label: 'My Books',  icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
                        { label: 'Read List', icon: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' },
                        { label: 'Settings',  icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
                      ].map(({ label, icon }) => (
                        <button key={label} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.07] text-[13px] transition-all">
                          <svg className="w-3.5 h-3.5 stroke-current shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8}>
                            <path d={icon}/>
                          </svg>
                          {label}
                        </button>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:text-[#E20C11] hover:bg-[#E20C11]/10 text-[13px] transition-all"
                      >
                        <svg className="w-3.5 h-3.5 stroke-current shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8}>
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
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