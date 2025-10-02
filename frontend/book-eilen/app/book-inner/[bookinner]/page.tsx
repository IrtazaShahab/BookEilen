'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, BookMarked, ArrowLeft, Star, Calendar, User, BookOpen } from 'lucide-react';

const API_BASE = 'http://localhost:3040/api/books';

export default function BookDetailPage() {
    const params = useParams();
    const router = useRouter();
    const bookId = params?.bookinner;

    console.log('Params object:', params); // This will show you what's actually in params
    console.log('Book ID:', bookId);

    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (bookId) {
            console.log('Book ID from URL:', bookId); // Debug
            fetchBookDetails();
        }
    }, [bookId]);

    const fetchBookDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const url = `${API_BASE}/${bookId}`;
            console.log('Fetching from:', url); // Debug

            const res = await fetch(url);
            console.log('Response status:', res.status); // Debug

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch: ${res.status} - ${errorText}`);
            }

            const data = await res.json();
            console.log('Book data:', data); // Debug

            setBook(data);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#181818] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                    <p className="text-white text-lg">Loading book details...</p>
                    <p className="text-gray-400 text-sm mt-2">Book ID: {bookId}</p>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-[#181818] flex items-center justify-center">
                <div className="text-center max-w-md p-6">
                    <p className="text-red-500 text-xl mb-4">Error loading book</p>
                    <p className="text-gray-400 mb-4">{error || 'Book not found'}</p>
                    <p className="text-gray-500 text-sm mb-4">Book ID: {bookId}</p>
                    <button onClick={() => router.back()} className="bg-[#e50914] text-white px-6 py-2 rounded-lg hover:bg-[#ad0810]">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const { volumeInfo } = book;
    const thumbnail = volumeInfo?.imageLinks?.thumbnail || volumeInfo?.imageLinks?.smallThumbnail;
    const rating = volumeInfo?.averageRating || 0;

    return (
        <div className="min-h-screen bg-[#181818] text-white p-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-300 hover:text-white mb-6">
                <ArrowLeft size={20} />
                Back to Dashboard
            </button>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Book Image */}
                <div className="lg:col-span-1">
                    <div className="bg-[#282828] rounded-2xl p-6">
                        {thumbnail ? (
                            <img src={thumbnail.replace('http:', 'https:')} alt={volumeInfo?.title} className="w-full rounded-lg" />
                        ) : (
                            <div className="w-full h-96 bg-gray-700 rounded-lg flex items-center justify-center">
                                <BookOpen size={64} className="text-gray-500" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Book Info */}
                <div className="lg:col-span-2 space-y-6">
                    <h1 className="text-4xl font-bold">{volumeInfo?.title}</h1>

                    {volumeInfo?.authors && <p className="text-xl text-gray-300">by {volumeInfo.authors.join(', ')}</p>}

                    {rating > 0 && (
                        <div className="flex items-center gap-2">
                            <Star size={20} className="text-yellow-500" fill="currentColor" />
                            <span className="text-xl">{rating.toFixed(1)}</span>
                        </div>
                    )}

                    <div className="bg-[#282828] rounded-xl p-6">
                        <h2 className="text-2xl font-semibold mb-4">Description</h2>
                        <div
                            className="text-gray-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: volumeInfo?.description || 'No description available' }}
                        />
                    </div>

                    {volumeInfo?.publishedDate && (
                        <div className="bg-[#282828] rounded-xl p-4">
                            <p className="text-gray-400">Published: {volumeInfo.publishedDate}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
