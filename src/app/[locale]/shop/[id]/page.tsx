"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaRegStar, FaStar } from "react-icons/fa";
import { BookType } from "@/types/BookType";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import StartChatButton from "@/components/chat/StartChatButton";
import { useAuth } from "@/context/AuthContext";

export default function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState<BookType | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      const q = query(collection(db, "books"), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setBook(doc.data() as BookType);
      }
    };
    if (id) fetchBook();
  }, [id]);

  if (!book) {
    return <div className="text-center py-20">Loading book details...</div>;
  }

  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row gap-10 py-16 container mx-auto px-20">
        {/* Left Section - Images */}
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-2 overflow-y-auto">
            {[...Array(4)].map((_, i) => (
              <Image
                width={500}
                height={500}
                key={i}
                src={book.coverImage}
                alt=""
                className="w-24 h-24 object-cover rounded-md border"
              />
            ))}
          </div>
          <div className="w-full">
            <Image
              width={500}
              height={500}
              src={book.coverImage}
              alt=""
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Right Section - Product Info */}
        <div className="flex flex-col gap-4 lg:w-1/2">
          <h2 className="text-2xl font-semibold">{book.title}</h2>
          <p className="text-sm text-gray-500 font-semibold">
            Author: {book.author}
          </p>
          <p className="text-sm text-gray-500 font-semibold">
            Genre: {book.genre}
          </p>

          <div className="flex items-center gap-1">
            {book.averageRating !== undefined && (
              <div className="flex items-center text-[#B17457] mb-1 gap-0.5 text-base">
                {Array.from({ length: 5 }, (_, i) =>
                  i < Math.round(book.averageRating!) ? (
                    <FaStar key={i} />
                  ) : (
                    <FaRegStar key={i} />
                  )
                )}
                <span className="ml-2  text-[#4A4947]">
                  {book.averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {book.availableFor.includes("sell") && (
            <div className="flex items-center gap-4">
              {/* <p className="text-lg line-through font-bold text-gray-500">${book.price?.toFixed(2)}</p> */}
              <p className="text-2xl font-bold text-green-600">
                ${book.price?.toFixed(2)}
              </p>
            </div>
          )}

          <p className="text-sm text-gray-700 leading-relaxed">
            {book.description}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            {book.availableFor.includes("sell") && (
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl">
                Add to Cart
              </button>
            )}
            {book.availableFor.includes("swap") && (
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl">
                Request Swap
              </button>
            )}
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl">
              Add to Wishlist
            </button>
            <StartChatButton
              currentUserId={user!.uid}
              otherUserId={book.ownerId}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
