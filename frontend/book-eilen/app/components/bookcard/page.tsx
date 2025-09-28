'use client';

import React from 'react';
import Image from 'next/image';
import placeholderImage from '@/assets/images/open-book-with-fairytale-scene.jpg';


interface BookCardProps {
    book: any;
}

const PLACEHOLDER_BOOK = "https://via.placeholder.com/200x240/4A5568/FFFFFF?text=No+Image";

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const bookInfo = book.volumeInfo;
    const saleInfo = book.saleInfo;
    const accessInfo = book.accessInfo;

    // Get different types of links
    const previewLink = bookInfo?.previewLink;
    const infoLink = bookInfo?.infoLink;
    const buyLink = saleInfo?.buyLink;
    const webReaderLink = accessInfo?.webReaderLink;

    // Check if book is available for reading
    const isReadable = accessInfo?.viewability === 'PARTIAL' || accessInfo?.viewability === 'ALL_PAGES';

    return (
        <div className="w-[280px] h-[505px] bg-[#282828] rounded-lg p-[20px] hover:bg-gray-700 transition-colors">
            {/* Book Cover */}
            <div className="mb-3">
                <img
                    src={bookInfo?.imageLinks?.thumbnail || PLACEHOLDER_BOOK}
                    alt={bookInfo?.title || 'Book cover'}
                    className="w-[245px] h-[300px] object-cover rounded"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'PLACEHOLDER_BOOK';
                    }}
                />
            </div>

            {/* Book Info */}
            <div className="text-white">
                <h3 className="font-semibold text-[25px] mb-2 line-clamp-2">
                    {bookInfo?.title || 'Unknown Title'}
                </h3>

                <p className="text-gray-300 text-[16px] mb-2 opacity-[0.8]">
                    by {bookInfo?.authors?.join(', ') || 'Unknown Author'}
                </p>

                {/* Book Links Section */}
                <div className="flex justify-center flex-wrap gap-2 mb-3">

                    {/* Preview Link - Most Important */}
                    {previewLink && (
                        <a
                            href={previewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                            📖 Preview
                        </a>
                    )}

                    {/* Web Reader Link - For reading online */}
                    {webReaderLink && isReadable && (
                        <a
                            href={webReaderLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                            📚 Read Online
                        </a>
                    )}

                    {/* Buy Link - For purchasing */}
                    {buyLink && (
                        <a
                            href={buyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                            🛒 Buy
                        </a>
                    )}

                    {/* Google Books Info Link */}
                    {infoLink && (
                        <a
                            href={infoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                            ℹ️ More Info
                        </a>
                    )}
                </div>

                {/* Rating */}
                {bookInfo?.averageRating && (
                    <div className="mt-2 text-yellow-400 text-sm">
                        ⭐ {bookInfo.averageRating} ({bookInfo.ratingsCount || 0} reviews)
                    </div>
                )}

                {/* Published Date */}
                {bookInfo?.publishedDate && (
                    <div className="mt-1 text-gray-500 text-xs">
                        Published: {bookInfo.publishedDate}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookCard;
