'use client';
import { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import BookCard from '../components/bookcard/page';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

// images
import CarousalImage1 from '@/assets/images/horse-rider-img.webp';
import CarousalImage2 from '@/assets/images/man-in-rain.webp';
import CarousalImage3 from '@/assets/images/white-unicorn-with-pink-hair.webp';
import CarousalImage4 from '@/assets/images/traded-company-wall-street.webp';

const API_BASE = 'http://localhost:3040/api/books';
const CATEGORY_LIST = ['All', 'Fiction', 'Romance', 'Mystery', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Self Help'];
const MAX_PAGES = 50; // Limit maximum pages

export default function Dashboard() {
    const [categories, setCategories] = useState<Record<string, any[]>>({});
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [categoryPages, setCategoryPages] = useState<Record<string, number>>({});

    // Fetch books by query with pagination
    async function fetchBooksFromBackend(qParam: string, max = 12, startIndex = 0) {
        try {
            const url = `${API_BASE}?q=${encodeURIComponent(qParam)}&maxResults=${max}&startIndex=${startIndex}`;
            const res = await fetch(url);
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Backend error ${res.status}: ${txt}`);
            }
            const data = await res.json();
            return {
                items: data.items || [],
                totalItems: data.totalItems || 0,
            };
        } catch (err: any) {
            console.error('fetchBooksFromBackend error:', err);
            throw err;
        }
    }

    // Handle category click for single category view
    const handleCategoryClick = async (category: string, page = 1) => {
        try {
            setLoading(true);
            setError(null);
            setCurrentPage(page);

            if (category === 'All') {
                setSelectedCategory('All');
                const data: Record<string, any[]> = {};
                const pages: Record<string, number> = {};

                for (const cat of CATEGORY_LIST.filter((c) => c !== 'All')) {
                    try {
                        const result = await fetchBooksFromBackend(`subject:${cat}`, 20, 0);
                        data[cat] = result.items;
                        pages[cat] = 1;
                    } catch {
                        data[cat] = [];
                        pages[cat] = 1;
                    }
                }
                setCategories(data);
                setCategoryPages(pages);
                setBooks([]);
                setTotalResults(0);
            } else {
                setSelectedCategory(category);
                const startIndex = (page - 1) * 20;
                const result = await fetchBooksFromBackend(`subject:${category}`, 20, startIndex);
                setBooks(result.items);
                // Limit total results to show max 50 pages
                const limitedTotal = Math.min(result.totalItems, MAX_PAGES * 20);
                setTotalResults(limitedTotal);
                setCategories({});
            }
        } catch (err) {
            console.error('Category click error:', err);
            setError('Failed to load category books');
        } finally {
            setLoading(false);
        }
    };

    // Handle "load more" for category in All Categories view
    const handleLoadMoreBooks = async (category: string) => {
        try {
            setLoading(true);
            const currentCatPage = categoryPages[category] || 1;
            const startIndex = currentCatPage * 8; // load next set

            const result = await fetchBooksFromBackend(`subject:${category}`, 8, startIndex);

            setCategories((prev) => ({
                ...prev,
                [category]: [...(prev[category] || []), ...result.items], // append instead of replace
            }));

            setCategoryPages((prev) => ({
                ...prev,
                [category]: currentCatPage + 1, // increment page count
            }));
        } catch (err) {
            console.error('Load more error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle page change for single category view
    const handlePageChange = (page: number) => {
        handleCategoryClick(selectedCategory, page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Calculate total pages (max 50)
    const totalPages = Math.min(Math.ceil(totalResults / 20), MAX_PAGES);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    // Load "All" by default
    useEffect(() => {
        (async () => {
            await handleCategoryClick('All');
        })();
    }, []);

    return (
        <div className="main-page min-h-screen p-6 bg-[#181818] text-white">
            {/* Carousel */}
            <div className="relative w-full h-[400px] mb-[80px]">
                <Carousel autoplay className="w-full h-full">
                    {[CarousalImage1, CarousalImage2, CarousalImage3, CarousalImage4].map((img, i) => (
                        <div key={i} className="relative w-[800px] h-[400px]">
                            <Image src={img} alt={`Ad ${i + 1}`} fill className="object-cover" />
                        </div>
                    ))}
                </Carousel>
                <div className="absolute bottom-10 left-10 z-20 text-white">
                    <h2 className="text-3xl font-bold">Discover New Stories</h2>
                    <button className="px-6 py-1 hover:bg-[#ad0810] bg-[#e50914] font-medium rounded-[25px]">Explore</button>
                </div>
            </div>

            {/* Category buttons */}
            <div className="category-buttons flex justify-center my-10">
                <div className="flex justify-center flex-wrap w-[1080px] bg-[#282828] rounded-[25px] gap-[30px] py-[15px]">
                    {CATEGORY_LIST.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat, 1)}
                            className={`relative inline-block pb-1
                                after:absolute after:left-0 after:bottom-0
                                after:h-[2px] after:w-0 after:bg-white
                                after:transition-all after:duration-300
                                font-semibold transition-colors rounded-none transition-all duration-250 ease-out ${
                                    selectedCategory === cat
                                        ? 'text-[#e50914] border-b-[2px] border-b-white rounded-none after:hidden'
                                        : 'after:w-0 hover:after:w-full hover:text-[#e50914]'
                                }`}
                        >
                            {cat === 'All' ? 'All Categories' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="mt-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <p className="mt-2">Loading books...</p>
                </div>
            )}

            {/* Error */}
            {error && <div className="mt-4 bg-red-600 text-white p-3 rounded">{error}</div>}

            {/* Render logic */}
            {!loading && !error && (
                <>
                    {/* Single category with pagination */}
                    {selectedCategory !== 'All' && (
                        <>
                            <div className="mt-3 mb-4 text-gray-300">
                                Showing: Page {currentPage} of {totalPages}
                                {books.length > 0 && (
                                    <span className="ml-2 text-gray-400">
                                        ({totalResults} total books, max {MAX_PAGES} pages)
                                    </span>
                                )}
                            </div>
                            <span className="text-white text-3xl font-semibold mb-4">{selectedCategory}</span>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-[40px] gap-y-[50px] mt-4 mb-10">
                                {books.map((book, index) => (
                                    <div key={book.id || index} onClick={() => router.push(`/book/${book.id}`)}>
                                        <div className="cursor-pointer transform transition-transform hover:scale-105">
                                            <BookCard book={book} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 my-8">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                                            currentPage === 1
                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                : 'bg-[#282828] text-white hover:bg-[#e50914]'
                                        }`}
                                    >
                                        <ChevronLeft size={20} />
                                        Previous
                                    </button>

                                    <div className="flex gap-2">
                                        {getPageNumbers().map((page, index) => (
                                            <button
                                                key={index}
                                                onClick={() => typeof page === 'number' && handlePageChange(page)}
                                                disabled={page === '...'}
                                                className={`px-4 py-2 rounded-lg ${
                                                    page === currentPage
                                                        ? 'bg-[#e50914] text-white'
                                                        : page === '...'
                                                        ? 'bg-transparent text-gray-400 cursor-default'
                                                        : 'bg-[#282828] text-white hover:bg-[#e50914]'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                                            currentPage === totalPages
                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                : 'bg-[#282828] text-white hover:bg-[#e50914]'
                                        }`}
                                    >
                                        Next
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* All categories with pagination for each row */}
                    {selectedCategory === 'All' && (
                        <>
                            {Object.entries(categories).map(([cat, books]) => {
                                const visibleIndex = categoryPages[cat] || 0; // track scroll offset
                                const visibleBooks = books.slice(visibleIndex, visibleIndex + 6);

                                return (
                                    <section key={cat} className="mb-12">
                                        {/* Header with arrows */}
                                        <div className="flex justify-between items-center mb-[20px]">
                                            <h3 className="text-xl font-semibold">{cat}</h3>
                                            <div className="flex gap-2">
                                                {/* Left button */}
                                                <button
                                                    onClick={() =>
                                                        setCategoryPages((prev) => ({
                                                            ...prev,
                                                            [cat]: Math.max((prev[cat] || 0) - 1, 0), // move one "page" left
                                                        }))
                                                    }
                                                    disabled={(categoryPages[cat] || 0) === 0}
                                                    className="p-2 rounded-lg bg-[#282828] text-white hover:bg-[#e50914] disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>

                                                {/* Right button */}
                                                <button
                                                    onClick={async () => {
                                                        const nextPage = (categoryPages[cat] || 0) + 1;
                                                        const startIndex = nextPage * 8;

                                                        // if not enough books, fetch more
                                                        if (books.length < startIndex + 8) {
                                                            const result = await fetchBooksFromBackend(`subject:${cat}`, 8, books.length);
                                                            if (result.items.length > 0) {
                                                                setCategories((prev) => ({
                                                                    ...prev,
                                                                    [cat]: [...books, ...result.items],
                                                                }));
                                                            }
                                                        }

                                                        setCategoryPages((prev) => ({
                                                            ...prev,
                                                            [cat]: nextPage,
                                                        }));
                                                    }}
                                                    className="p-2 rounded-lg bg-[#282828] text-white hover:bg-[#e50914]"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Horizontal scroll */}
                                        <div className="relative overflow-hidden">
                                            <div
                                                className="flex gap-6 transition-transform duration-500 ease-out"
                                                style={{
                                                    transform: `translateX(-${(categoryPages[cat] || 0) * (170 * 8)}px)`,
                                                    // 170px ≈ BookCard width (150) + gap (20). Adjust this to match your BookCard
                                                }}
                                            >
                                                {books.map((book, index) => (
                                                    <Link
                                                        key={book.id || index}
                                                        href={`/book/${book.id}`}
                                                        className="flex-shrink-0 w-[250px]"
                                                    >
                                                        <BookCard book={book} />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                );
                            })}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
