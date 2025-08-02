
'use client';

import { useBooks } from "@/context/BooksContext";
import Image from "next/image";
import Link from "next/link";
// import { FaRegStar, FaStar } from "react-icons/fa";

function matchesPrice(price: number, range: string) {
  const [min, max] = range.split("-").map(Number);
  return price >= min && price <= max;
}
interface Props {
  selectedGenres: string[];
  selectedPriceRanges: string[];
  selectedAvilable: string[];
  selectedCondition: string[];
  currentPage: number;
  booksPerPage: number;
  setCurrentPage: (page: number) => void;
}

export default function ShopBookGrid({
  selectedGenres,
  selectedPriceRanges,
  selectedAvilable,
  selectedCondition,
  currentPage,
  booksPerPage,
  setCurrentPage,
}: Props) {
  const { books, loading } = useBooks();


  if (loading) {
    return <p className="text-center py-10">Loading books...</p>;
  }

  const filteredBooks = books.filter(book => book.approval === 'approved' && book.isDeleted === false).filter(book => {
    const genreMatch =
      selectedGenres.length === 0 || selectedGenres.includes(book.genre);

    const priceMatch =
      selectedPriceRanges.length === 0 ||
      (book.price !== undefined && selectedPriceRanges.some((range) => matchesPrice(book.price!, range)));

    const availableMatch = 
      selectedAvilable.length === 0 || book.availableFor.some((option) => selectedAvilable.includes(option));;

    const conditionMatch =
      selectedCondition.length === 0 || selectedCondition.includes(book.condition);

    return genreMatch && priceMatch && conditionMatch && availableMatch;
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );
  
  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      { paginatedBooks.map((book) => (
        <Link
          key={book.id}
          href={`/shop/${book.id}`}
          style={{ position: 'relative' }}
          className="bg-gray-100 position-relative transform hover:scale-[1.02] ease-in-out cursor-pointer rounded-2xl shadow-lg hover:shadow-xl transition duration-500 block"
        >
          <Image
            width={600}
            height={48}
            src={book.coverImage}
            alt={book.title}
            className="w-full h-[250px] object-cover rounded-t mb-1"
          />
          <div className="p-4">
            {/* {book.averageRating !== undefined && (
              <div className="flex items-center text-yellow-500 mb-1 gap-0.5 text-base">
                {Array.from({ length: 5 }, (_, i) =>
                  i < Math.round(book.averageRating!) ? (<FaStar key={i} />) : (<FaRegStar key={i} />)
                )}
                <span className="ml-2 text-[#4A4947]">{book.averageRating.toFixed(1)}</span>
              </div>
            )} */}
            <h4 className="font-semibold text-[#4A4947] text-lg">{ book.title.length >= 25 ? `${book.title.slice(0,25)}...` : `${book.title}` }</h4>
            <p className="text-sm my-1 text-gray-600">{book.author}</p>
            {book.availableFor.includes('sell') ? (
              <p className="mt-1 text-lg font-semibold primary-color">${book.price?.toFixed(2)}</p>
            ) : (<p className="mt-1 text-lg pt-7 font-semibold primary-color"></p>)}
            <div style={{ position: 'absolute'}} className='top-2 mt-4 '>
              {book.availableFor.includes('sell') && (
                <span className="bg-primary-color mr-3 text-gray-50 px-5 py-2.5 rounded-full text-md">
                  Sale
                </span>
              )}
              {book.availableFor.includes('swap') && (
                <span className="bg-primary-color mr-3 text-gray-50 px-5 py-2.5 rounded-full text-md">
                  Exchange
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
    {totalPages > 1 && (
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#D8D2C2] rounded hover:bg-[#c0bbad] disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#D8D2C2] rounded hover:bg-[#c0bbad] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )}
    </>
  );
}
