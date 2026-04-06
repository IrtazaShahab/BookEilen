'use client';

import React from 'react';

interface BookCardProps {
    book: any;
}

const PLACEHOLDER_BOOK = 'https://picsum.photos/200/300';

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const bookInfo = book?.volumeInfo ?? {};
    const accessInfo = book?.accessInfo ?? {};

    const title = typeof bookInfo.title === 'string' && bookInfo.title.trim() !== '' ? bookInfo.title : 'Unknown Title';

    const authors = Array.isArray(bookInfo.authors) ? bookInfo.authors.join(', ') : 'Unknown Author';

    const cover = typeof bookInfo?.imageLinks?.thumbnail === 'string' ? bookInfo.imageLinks.thumbnail : PLACEHOLDER_BOOK;

    const previewLink = bookInfo?.previewLink ?? null;
    const infoLink = bookInfo?.infoLink ?? null;

    return (
        <div className="bookcard group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-110">
            {/* Book Cover (no Link here, just image) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={cover}
                alt={title}
                className="w-full h-[300px] object-cover rounded"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = PLACEHOLDER_BOOK;
                }}
            />

            {/* Book Info */}
            <div className="bookcard-wrapper text-white absolute w-[100%] !bottom-0 p-[20px] !bg-opacity-80 !group-hover:bg-opacity-80 opacity-0 transition-opacity duration-250 ease-out pointer-events-none group-hover:pointer-events-auto">
                <h5 className="!font-semibold text-[25px] mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{title}</h5>

                <p className="!font-normal text-gray-500 text-[16px] mb-3 opacity-80 whitespace-nowrap overflow-hidden text-ellipsis">
                    by {authors}
                </p>

                {/* External Links */}
                <div className="flex justify-between gap-2">
                    {previewLink && (
                        <button
                            onClick={() => window.open(previewLink)}
                            rel="noopener noreferrer"
                            className="bg-[#e50914] hover:bg-[#ad0810] text-white !text-[14px] transition-colors !font-medium !rounded-[25px] py-[3px] px-[18px]"
                        >
                            Preview
                        </button>
                    )}

                    {infoLink && (
                        <button
                            onClick={() => window.open(infoLink)}
                            rel="noopener noreferrer"
                            className="bg-gray-500 hover:bg-gray-600 text-white !text-[14px] transition-colors !font-medium !rounded-[25px] py-[3px] px-[18px]"
                        >
                            More Info
                        </button>
                    )}
                </div>

                {bookInfo?.publishedDate && <div className="mt-1 text-gray-200 text-xs">Published: {bookInfo.publishedDate}</div>}
            </div>
        </div>
    );
};

export default BookCard;
