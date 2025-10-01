'use client';

import React from 'react';

interface BookCardProps {
    book: any;
}

const PLACEHOLDER_BOOK = 'https://via.placeholder.com/200x240/4A5568/FFFFFF?text=No+Image';

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const bookInfo = book?.volumeInfo ?? {};
    const accessInfo = book?.accessInfo ?? {};

    const title = typeof bookInfo.title === 'string' && bookInfo.title.trim() !== '' ? bookInfo.title : 'Unknown Title';

    const authors = Array.isArray(bookInfo.authors) ? bookInfo.authors.join(', ') : 'Unknown Author';

    const cover = typeof bookInfo?.imageLinks?.thumbnail === 'string' ? bookInfo.imageLinks.thumbnail : PLACEHOLDER_BOOK;

    const previewLink = bookInfo?.previewLink ?? null;
    const infoLink = bookInfo?.infoLink ?? null;

    return (
        <div className="relative overflow-hidden rounded-lg hover:bg-[#281516] transition-transform duration-300 hover:scale-140">
            {/* Book Cover (no Link here, just image) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={cover}
                alt={title}
                className="w-full h-[300px] object-cover rounded mb-4"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = PLACEHOLDER_BOOK;
                }}
            />

            {/* Book Info */}
            <div className="text-white absolute !bottom-0 padding-[20px] !bg-[rgba(36, 28, 28, 0.5)] opacity-0 !group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                <h5 className="!font-semibold text-[25px] mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{title}</h5>

                <p className="!font-normal text-gray-500 text-[16px] mb-3 opacity-80 whitespace-nowrap overflow-hidden text-ellipsis">
                    by {authors}
                </p>

                {/* External Links */}
                <div className="flex justify-between gap-2">
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

                {bookInfo?.publishedDate && <div className="mt-1 text-gray-500 text-xs">Published: {bookInfo.publishedDate}</div>}
            </div>
        </div>
    );
};

export default BookCard;
