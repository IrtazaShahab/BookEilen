'use client';

import React from 'react';
import Image from 'next/image';
import placeholderImage from '@/assets/images/open-book-with-fairytale-scene.jpg';

interface BookCardProps {
    book: any;
}

const PLACEHOLDER_BOOK = 'https://via.placeholder.com/200x240/4A5568/FFFFFF?text=No+Image';

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const bookInfo = book.volumeInfo;
    const accessInfo = book.accessInfo;

    // Get different types of links
    const previewLink = bookInfo?.previewLink;
    const infoLink = bookInfo?.infoLink;

    // Check if book is available for reading
    const isReadable = accessInfo?.viewability === 'PARTIAL' || accessInfo?.viewability === 'ALL_PAGES';

    return (
        <div className="overflow-hidden h-[505px] bg-[#282828] rounded-lg p-[20px] hover:bg-[#281516] transition-colors transition-transform duration-300 hover:scale-[1.01]">
            {/* Book Cover */}
            <div className="mb-4">
                <img
                    src={bookInfo?.imageLinks?.thumbnail || PLACEHOLDER_BOOK}
                    alt={bookInfo?.title || 'Book cover'}
                    className="w-[100%] h-[300px] object-cover rounded"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'PLACEHOLDER_BOOK';
                    }}
                />
            </div>

            {/* Book Info */}
            <div className="text-white">
                <h5 className="!font-semibold text-[25px] mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{bookInfo?.title || 'Unknown Title'}</h5>

                <p className="!font-normal text-gray-500 text-[16px] mb-3 opacity-[0.8] whitespace-nowrap overflow-hidden text-ellipsis">by {bookInfo?.authors?.join(', ') || 'Unknown Author'}</p>

                {/* Book Links Section */}
                <div className="flex justify-between gap-2">
                    {/* Preview Link - Most Important */}
                    {previewLink && (
                        <a
                            href={previewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#e50914] hover:bg-[#ad0810] text-white text-sm transition-colors font-medium rounded-[25px] py-[3px] px-[18px]"
                        >
                            Preview
                        </a>
                    )}

                    {/* Google Books Info Link */}
                    {infoLink && (
                        <a
                            href={infoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-500 hover:bg-gray-600 text-white text-sm transition-colors font-medium rounded-[25px] py-[3px] px-[18px]"
                        >
                            More Info
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
                {bookInfo?.publishedDate && <div className="mt-1 text-gray-500 text-xs">Published: {bookInfo.publishedDate}</div>}
            </div>
        </div>
    );
};

export default BookCard;
