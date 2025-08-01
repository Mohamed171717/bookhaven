"use client";

import { useBooks } from "@/context/BooksContext";
import Image from "next/image";
import Link from "next/link";
import { FaRegStar, FaStar } from "react-icons/fa";

function matchesPrice(price: number, range: string) {
  const [min, max] = range.split("-").map(Number);
  return price >= min && price <= max;
}
interface Props {
  selectedGenres: string[];
  selectedPriceRanges: string[];
  currentPage: number;
  booksPerPage: number;
  setCurrentPage: (page: number) => void;
}

export default function ShopBookGrid({
  selectedGenres,
  selectedPriceRanges,
  currentPage,
  booksPerPage,
  setCurrentPage,
}: Props) {
  const { books, loading } = useBooks();
  console.log(books);

  if (loading) {
    return <p className="text-center py-10">Loading books...</p>;
  }

  const filteredBooks = books.filter((book) => {
    const genreMatch =
      selectedGenres.length === 0 || selectedGenres.includes(book.genre);

    const priceMatch =
      selectedPriceRanges.length === 0 ||
      (book.price !== undefined &&
        selectedPriceRanges.some((range) => matchesPrice(book.price!, range)));

    return genreMatch && priceMatch;
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedBooks.map((book) => (
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
                <div className="flex items-center text-yellow-500 mb-1 gap-0.5 text-base">
                  {Array.from({ length: 5 }, (_, i) =>
                    i < Math.round(book.averageRating!) ? (
                      <FaStar key={i} />
                    ) : (
                      <FaRegStar key={i} />
                    )
                  )}
                  <span className="ml-2 text-[#4A4947]">
                    {book.averageRating}
                  </span>
                </div>
              )}
              <h4 className="font-semibold my-1 text-[#4A4947] text-lg">
                {book.title.length >= 25
                  ? `${book.title.slice(0, 25)}...`
                  : `${book.title}`}
              </h4>
              <p className="text-sm my-1 text-gray-600">{book.author}</p>
              {book.availableFor.includes("sell") ? (
                <p className="mt-1 text-lg font-semibold text-[#a8775a]">
                  ${book.price}
                </p>
              ) : (
                <p className="mt-1 text-lg pt-7 font-semibold text-[#a8775a]"></p>
              )}
              <div className="flex items-center mt-4 justify-between">
                {book.availableFor.includes("sell") && (
                  <button
                    onClick={(e) => e.stopPropagation}
                    className="bg-btn-color text-[15px] hover:bg-[#a16950] text-gray-50 py-2 px-4 rounded-full transition duration-300"
                  >
                    Add to Cart
                  </button>
                )}
                {book.availableFor.includes("swap") && (
                  <button
                    onClick={(e) => e.stopPropagation}
                    className="bg-btn-color text-[15px] hover:bg-[#a16950] text-gray-50 py-2 px-4 rounded-full transition duration-300"
                  >
                    Exchange
                  </button>
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
