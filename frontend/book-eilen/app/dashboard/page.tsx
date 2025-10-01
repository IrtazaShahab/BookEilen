'use client';
import { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import Image from 'next/image';
import BookCard from '../components/bookcard/page';

// images
import CarousalImage1 from '@/assets/images/horse-rider-img.webp';
import CarousalImage2 from '@/assets/images/man-in-rain.webp';
import CarousalImage3 from '@/assets/images/white-unicorn-with-pink-hair.webp';
import CarousalImage4 from '@/assets/images/traded-company-wall-street.webp';

const API_BASE = 'http://localhost:3040/api/books'; // backend route
const CATEGORY_LIST = ['All', 'Fiction', 'Romance', 'Mystery', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Self Help'];

export default function Dashboard() {
    const [categories, setCategories] = useState<Record<string, any[]>>({});
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch books by query
    async function fetchBooksFromBackend(qParam: string, max = 12) {
        try {
            const url = `${API_BASE}?q=${encodeURIComponent(qParam)}&maxResults=${max}`;
            const res = await fetch(url);
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Backend error ${res.status}: ${txt}`);
            }
            const data = await res.json();
            return data.items || [];
        } catch (err: any) {
            console.error('fetchBooksFromBackend error:', err);
            throw err;
        }
    }

    // Handle category click
    const handleCategoryClick = async (category: string) => {
        try {
            setLoading(true);
            setError(null);

            if (category === 'All') {
                setSelectedCategory('All');

                const data: Record<string, any[]> = {};
                for (const cat of CATEGORY_LIST.filter((c) => c !== 'All')) {
                    try {
                        const items = await fetchBooksFromBackend(`subject:${cat}`, 8);
                        data[cat] = items;
                    } catch {
                        data[cat] = [];
                    }
                }
                setCategories(data);
                setBooks([]); // clear grid
            } else {
                setSelectedCategory(category);
                const categoryBooks = await fetchBooksFromBackend(`subject:${category}`, 20);
                setBooks(categoryBooks);
                setCategories({}); // clear rows
            }
        } catch (err) {
            console.error('Category click error:', err);
            setError('Failed to load category books');
        } finally {
            setLoading(false);
        }
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
                            onClick={() => handleCategoryClick(cat)}
                            className={`relative inline-block pb-1
          after:absolute after:left-0 after:bottom-0
          after:h-[2px] after:w-0 after:bg-white
          after:transition-all after:duration-300
        //   hover:after:w-full  font-semibold  transition-colors  rounded-none transition-all duration-250 ease-out ${
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
                    {/* Single category */}
                    {selectedCategory !== 'All' && (
                        <>
                            <div className="mt-3 mb-4 text-gray-300">
                                Showing:
                                {books.length > 0 && <span className="ml-2 text-gray-400">({books.length} books)</span>}
                            </div>
                            <span className="text-white text-3xl font-semibold mb-4">{selectedCategory}</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-x-[40px] gap-y-[50px] mt-4 mb-10">
                                {books.map((book, index) => (
                                    <BookCard key={book.id || index} book={book} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* All categories */}
                    {selectedCategory === 'All' && (
                        <>
                            {Object.entries(categories).map(([cat, books]) => (
                                <section key={cat} className="mb-8">
                                    <h3 className="text-xl font-semibold mb-[30px]">{cat}</h3>
                                    <div className="flex gap-4 overflow-x-auto pb-4">
                                        {books.map((book, index) => (
                                            <div key={index} className="w-[300px] shadow-md hover:shadow-lg transition">
                                                {/* Book Image */}
                                                {book.volumeInfo.imageLinks?.thumbnail && (
                                                    <img
                                                        src={book.volumeInfo.imageLinks.thumbnail}
                                                        alt={book.volumeInfo.title}
                                                        className="w-[300px] h-[300px] mb-[20px] object-contain"
                                                    />
                                                )}

                                                {/* Book Title (clickable link) */}
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[25px] font-semibold text-blue-600 hover:underline"
                                                >
                                                    {book.volumeInfo.title}
                                                </a>

                                                {/* Authors */}
                                                {book.volumeInfo.authors && (
                                                    <p className="text-xs text-gray-700 my-10">by {book.volumeInfo.authors.join(', ')}</p>
                                                )}

                                                {/* Preview link */}
                                                <a
                                                    href={book.volumeInfo.infoLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition-colors"
                                                >
                                                    More Info
                                                </a>

                                                {/* Publisher + Year */}
                                                <p className="text-xs text-gray-500">
                                                    {book.volumeInfo.publisher} ({book.volumeInfo.publishedDate})
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
