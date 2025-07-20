

'use client';

import { useBooks } from '@/context/BooksContext';
import Image from 'next/image';
import Link from 'next/link';
import { FaRegStar, FaStar } from 'react-icons/fa';



export default function ShopBookGrid() {
  const { books, loading } = useBooks();

  if (loading) {
    return <p className="text-center py-10">Loading books...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <Link
          key={book.id}
          href={`/shop/${book.id}`}
          className="bg-white cursor-pointer rounded-2xl shadow hover:shadow-lg transition block"
        >
          <Image
            width={600}
            height={48}
            src={book.coverImage}
            alt={book.title}
            className="w-full h-[250px] object-cover rounded-t mb-3"
          />
          <div className="p-4">
            {book.averageRating !== undefined && (
              <div className="flex items-center text-[#B17457] mb-1 gap-0.5 text-base">
                {Array.from({ length: 5 }, (_, i) =>
                  i < Math.round(book.averageRating!) ? (<FaStar key={i} />) : (<FaRegStar key={i} />)
                )}
                <span className="ml-2  text-[#4A4947]">{book.averageRating.toFixed(1)}</span>
              </div>
            )}
            <h4 className="font-semibold my-1 text-[#4A4947] text-lg">{ book.title.length >= 25 ? `${book.title.slice(0,25)}...` : `${book.title}` }</h4>
            <p className="text-sm my-1 text-gray-600">{book.author}</p>
            <div className='flex items-center mt-4 justify-between'>
            {book.price !== undefined && (
              <p className="mt-1 font-medium text-[#a8775a]">${book.price}</p>
            )}
            <button onClick={(e) => e.stopPropagation} className="bg-btn-color text-[15px] hover:bg-[#a16950] text-gray-50 py-2 px-4 rounded-full transition duration-300">
              Add to Cart
            </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
