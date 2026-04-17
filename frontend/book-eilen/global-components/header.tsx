'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/contexts/authcontext';
import { motion, AnimatePresence } from 'framer-motion';
import BookEilen from 'images/BookEilen.png';
const CATEGORIES = [
  { name: 'Fiction', bg: 'from-[#1a1a3e] to-[#3d2b8e]', desc: 'Imaginative worlds & stories', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop' },
  { name: 'Romance', bg: 'from-[#3d0c2e] to-[#8b1a5a]', desc: 'Love stories & relationships', coverImage: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300&h=400&fit=crop' },
  { name: 'Fantasy', bg: 'from-[#0d2b1a] to-[#1a6b3c]', desc: 'Magic, dragons & adventures', coverImage: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300&h=400&fit=crop' },
  { name: 'Historical', bg: 'from-[#2b1a0d] to-[#7a4a1a]', desc: 'Stories from the past', coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&h=400&fit=crop' },
  { name: 'Humor', bg: 'from-[#2b2b0d] to-[#8a7a1a]', desc: 'Comedy & lighthearted reads', coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop' },
  { name: 'Sci-Fi', bg: 'from-[#0d1a2b] to-[#1a4a8a]', desc: 'Futuristic & tech visions', coverImage: 'https://images.unsplash.com/photo-1636955816868-fcb881e57954?w=300&h=400&fit=crop' },
  { name: 'Horror', bg: 'from-[#1a0d0d] to-[#6b1a1a]', desc: 'Spine-chilling dark tales', coverImage: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=300&h=400&fit=crop' },
  { name: 'Mystery', bg: 'from-[#0d0d2b] to-[#2a1a6b]', desc: 'Whodunits & suspense', coverImage: 'https://images.unsplash.com/photo-1587876931567-564ce588bfbd?w=300&h=400&fit=crop' },
  { name: 'Poetry', bg: 'from-[#1a0d2b] to-[#5a1a8b]', desc: 'Verse, rhyme & expression', coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=400&fit=crop' },
  { name: 'Biography', bg: 'from-[#0d2b1a] to-[#2a6b3a]', desc: 'Real lives & memoirs', coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop' },
  { name: 'Thriller', bg: 'from-[#1a0d0d] to-[#8b2a1a]', desc: 'Edge-of-your-seat tension', coverImage: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=300&h=400&fit=crop' },
  { name: 'Self-Help', bg: 'from-[#1a1a1a] to-[#4a4a4a]', desc: 'Grow & improve yourself', coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop' },
];

/* ─────────────────────────────────────────────────────────────
   Fake search — replace with your real API call
───────────────────────────────────────────────────────────── */
type BookResult = { id: string; title: string; author: string; category: string; cover: string };

async function searchBooks(query: string): Promise<BookResult[]> {
  if (!query.trim()) return [];
  // TODO: swap this mock with your real endpoint, e.g.:
  // const res = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
  // return res.json();
  await new Promise((r) => setTimeout(r, 300)); // simulate latency
  const mock: BookResult[] = [
    { id: '1', title: `${query} — The Beginning`, author: 'A. Writer', category: 'Fiction', cover: '' },
    { id: '2', title: `${query} Chronicles`, author: 'B. Author', category: 'Fantasy', cover: '' },
    { id: '3', title: `Beyond ${query}`, author: 'C. Novelist', category: 'Sci-Fi', cover: '' },
    { id: '4', title: `The ${query} Diaries`, author: 'D. Prose', category: 'Romance', cover: '' },
  ];
  return mock;
}

/* ─────────────────────────────────────────────────────────────
   SearchBar — self-contained with results dropdown
───────────────────────────────────────────────────────────── */
function SearchBar({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (q: string) => {
    setLoading(true);
    const data = await searchBooks(q);
    setResults(data);
    setLoading(false);
    setOpen(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setResults([]); setOpen(false); return; }
    debounceRef.current = setTimeout(() => runSearch(val), 350);
  };

  const handleClear = () => { setQuery(''); setResults([]); setOpen(false); };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* Input */}
      <div className="flex items-center h-9 w-full rounded-full border border-white/30 px-3 gap-2 focus-within:border-white/60 transition">
        <MagnifyingGlassIcon className="h-4 w-4 text-white/50 shrink-0" />
        <input
          value={query}
          onChange={handleChange}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Search books…"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none min-w-0"
        />
        {query && (
          <button onClick={handleClear} className="shrink-0">
            <XMarkIcon className="h-4 w-4 text-white/50 hover:text-white transition" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+10px)] left-0 right-0 min-w-[320px] rounded-2xl bg-[#1e1e1e] border border-white/10 shadow-2xl overflow-hidden z-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-white/40">
                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white/70 animate-spin inline-block" />
                Searching…
              </div>
            ) : results.length === 0 ? (
              <p className="py-6 text-center text-sm text-white/40">No results found</p>
            ) : (
              <div>
                <p className="px-4 pt-3 pb-1 text-xs text-white/30 uppercase tracking-wider">Results for "{query}"</p>
                {results.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition group"
                  >
                    {/* Placeholder cover */}
                    <div className="h-10 w-8 rounded bg-gradient-to-br from-[#E20C11]/40 to-[#b30000]/40 shrink-0 flex items-center justify-center text-xs text-white/60 font-bold">
                      {book.title[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate group-hover:text-[#E20C11] transition">{book.title}</p>
                      <p className="text-xs text-white/40">{book.author} · <span className="text-white/30">{book.category}</span></p>
                    </div>
                  </Link>
                ))}
                <div className="border-t border-white/5 px-4 py-3">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={() => setOpen(false)}
                    className="text-xs text-[#E20C11] hover:underline"
                  >
                    See all results for "{query}" →
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Header
───────────────────────────────────────────────────────────── */
export default function Header() {
  const [browseOpen, setBrowseOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileBrowse, setMobileBrowse] = useState(false);
  const [avatarInitials, setAvatarInitials] = useState('IS');
  const [profileName, setProfileName] = useState('Irtza Shahab');
  const [profileEmail, setProfileEmail] = useState('irtazashahab@gmail.com');
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const router = useRouter();
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const { isLoggedIn, logout, isLoading } = useAuth()

  const handleLogout = () => { logout(); router.push('/auth/login-form'); };

  useEffect(() => {
    const raw = localStorage.getItem('userProfile');
    if (!raw) return;
    try {
      const user = JSON.parse(raw);
      const f = (user?.f_name || '').trim();
      const l = (user?.l_name || '').trim();
      const email = (user?.email || '').trim();
      const initials = `${f[0] || ''}${l[0] || ''}`.toUpperCase() || email.slice(0, 2).toUpperCase() || 'IS';
      setAvatarInitials(initials);
      setProfileName([f, l].filter(Boolean).join(' ') || 'Irtza Shahab');
      setProfileEmail(email || 'irtazashahab@gmail.com');
    } catch { }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <header className="fixed left-0 right-0 z-50">
        <div className="top-2 py-2 backdrop-blur-sm" />
        <div className="mx-auto sticky py-3 z-50 top-0 flex h-16 w-[95%] max-w-7xl items-center justify-between gap-4 rounded-[25px] bg-[#282828] px-4 md:px-6 shadow-lg shadow-[0_24px_64px_rgba(0,0,0,0.7)]">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image alt="BookEilen" src={BookEilen} width={130} height={30} />
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">

            {/* Browse Dropdown */}
            <div

              className="relative"
              onMouseEnter={() => setBrowseOpen(true)}
              onMouseLeave={() => setBrowseOpen(false)}
            >
              <button className="flex items-center gap-1 font-semibold rounded-full px-4 py-2 text-sm text-white hover:bg-white/10 transition">
                Browse
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${browseOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {browseOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-12 left-0 w-[520px] bg-[#1c1c1c] border border-white/[0.08] rounded-[22px] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.7)]"
                  >
                    {/* Header row */}
                    <p className="text-xs text-white/30 uppercase font-medium tracking-widest mb-3 px-1">Genres</p>

                    <div className="flex gap-4">
                      {/* Left: category list */}
                      <div className="flex-1 grid grid-cols-2 gap-y-0.5 gap-x-1">
                        {CATEGORIES.map((cat) => {
                          const active = selectedCat.name === cat.name;
                          return (
                            <button
                              key={cat.name}
                              onMouseEnter={() => setSelectedCat(cat)}
                              className={`flex items-center gap-2 px-3 py-[7px] rounded-xl text-left transition-all text-sm
                                ${active ? 'bg-white/[0.08] text-white' : 'text-white/50 hover:text-white hover:bg-white/[0.05]'}`}
                            >
                              <span className={active ? 'font-medium' : ''}>{cat.name}</span>
                              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#E20C11]" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Right: preview */}
                      {/* Right: genre image preview */}
                      <div className="w-[148px] shrink-0 flex flex-col gap-2">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={selectedCat.name}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                            className="relative rounded-2xl overflow-hidden mb-2"
                            style={{ height: '180px' }}
                          >
                            {/* Book cover image */}
                            <img
                              src={selectedCat.coverImage}
                              alt={selectedCat.name}
                              className="w-full h-full object-cover"
                            />
                            {/* Overlay with genre name + desc */}
                            <div className="absolute bottom-0 left-0 right-0 px-3 pt-6 pb-3 bg-gradient-to-t from-black/90 to-transparent">
                              <p className="text-white font-bold text-sm tracking-wide uppercase leading-tight">
                                {selectedCat.name}
                              </p>
                              <p className="text-white/60 text-[10px] mt-0.5 leading-snug">
                                {selectedCat.desc}
                              </p>
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        <Link
                          href={`/browse/${selectedCat.name.toLowerCase()}`}
                          className="block text-center text-xs bg-[#E20C11] hover:bg-[#ff1a1f] text-white rounded-xl py-2 transition font-medium"
                        >
                          Browse {selectedCat.name}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/dashboard" className="rounded-full px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition">Features</Link>
            <a href="#" className="rounded-full px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition">Community</a>
            <a href="#" className="rounded-full px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition">Blogs</a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* Desktop search */}
            <SearchBar className="hidden sm:block w-44 md:w-52" />

            {/* Auth */}
            {isLoading ? (
              <div className="w-20 h-9 rounded-full bg-white/10 hidden sm:block animate-pulse" />
            ) : !isLoggedIn ? (
              <Link
                href="/auth/login-form"
                className="hidden sm:inline-flex rounded-full bg-[#E20C11] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#ff1a1f]"
              >
                Log in
              </Link>
            ) : (
              <div ref={profileMenuRef} className="relative hidden sm:block">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff3c3c] to-[#b30000] text-sm font-semibold text-white shadow-md"
                >
                  {avatarInitials}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-12 right-[-20px] mt-3 w-52 rounded-2xl border border-white/10 bg-[#1c1c1c] p-4 shadow-2xl"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff3c3c] to-[#b30000] text-xs font-semibold text-white shrink-0">
                          {avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{profileName}</p>
                          <p className="text-xs text-white/40 truncate">{profileEmail}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {[
                          { label: 'Profile', action: () => { setProfileOpen(false); router.push('/profile'); } },
                          { label: 'Read List', action: () => setProfileOpen(false) },
                          { label: 'Settings', action: () => setProfileOpen(false) },
                        ].map(({ label, action }) => (
                          <button key={label} onClick={action} className="rounded-xl px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white transition">
                            {label}
                          </button>
                        ))}
                        <button
                          onClick={() => { setProfileOpen(false); handleLogout(); }}
                          className="rounded-xl px-3 py-2 text-left text-sm text-[#E20C11] hover:bg-[#E20C11]/10 transition"
                        >

                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Hamburger — shown below lg */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 transition text-white"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <XMarkIcon className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Bars3Icon className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>


      {/* ─── Mobile Drawer ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[80%] max-w-sm bg-[#1c1c1c] shadow-2xl flex flex-col lg:hidden overflow-y-auto"
            >
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
                <Image alt="BookEilen" src={BookEilen} width={110} height={26} />
                <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white transition">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-1 p-4 flex-1">
                {/* Mobile search */}
                <SearchBar className="w-full mb-3" />

                {/* Nav links */}
                {[
                  { label: 'Features', href: '/dashboard' },
                  { label: 'Community', href: '#' },
                  { label: 'Blogs', href: '#' },
                ].map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition"
                  >
                    {label}
                  </Link>
                ))}

                {/* Browse accordion */}
                <button
                  onClick={() => setMobileBrowse((p) => !p)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition"
                >
                  Browse
                  <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${mobileBrowse ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {mobileBrowse && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-1 px-2 pb-2">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.name}
                            href={`/browse/${cat.name.toLowerCase()}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Auth */}
                {!isLoggedIn ? (
                  <Link
                    href="/auth/login-form"
                    onClick={() => setMobileOpen(false)}
                    className="mt-4 rounded-full bg-[#E20C11] px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#ff1a1f]"
                  >
                    Log in
                  </Link>
                ) : (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-[#282828] p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff3c3c] to-[#b30000] text-xs font-semibold text-white shrink-0">
                        {avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{profileName}</p>
                        <p className="text-xs text-white/40 truncate">{profileEmail}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Profile', action: () => { setMobileOpen(false); router.push('/profile'); } },
                        { label: 'Read List', action: () => setMobileOpen(false) },
                        { label: 'Settings', action: () => setMobileOpen(false) },
                      ].map(({ label, action }) => (
                        <button key={label} onClick={action} className="rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white transition border border-white/10">
                          {label}
                        </button>
                      ))}
                      <button
                        onClick={() => { setMobileOpen(false); handleLogout(); }}
                        className="col-span-2 rounded-xl px-3 py-2 text-sm text-[#E20C11] hover:bg-[#E20C11]/10 transition border border-[#E20C11]/20"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}