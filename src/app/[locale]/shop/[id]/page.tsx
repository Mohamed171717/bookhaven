"use client";

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FaRegStar, FaStar } from 'react-icons/fa';
import { BookType } from '@/types/BookType'
import { useCart } from '@/context/CartContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import ReviewSection from '@/components/ReviewSection'
import { useAuth } from '@/context/AuthContext'
import { UserType } from '@/types/UserType';

export default function BookDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState<BookType | null>(null);
  const [bookOwner, setBookOwner] = useState<UserType>();
  const { addToCart } = useCart();

  // get the book
  useEffect(() => {
    const fetchBookAndOwner = async () => {
      const q = query(collection(db, "books"), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const bookData = doc.data() as BookType;
        setBook(bookData);

        // Fetch owner
        const userQ = query(collection(db, "users"), where("uid", "==", bookData.ownerId));
        const userSnapshot = await getDocs(userQ);
        if (!userSnapshot.empty) {
          setBookOwner(userSnapshot.docs[0].data() as UserType);
        }
      }
    };

    if (id) fetchBookAndOwner();
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
        <div className="flex flex-col gap-2 lg:w-1/2">
          <h2 className="text-2xl font-semibold">{book.title}</h2>
          <p className="text-sm text-gray-500 font-semibold">Author: {book.author}</p>
          <p className="text-sm text-gray-500 font-semibold">Genre: {book.genre}</p>
          <p className="text-sm text-gray-500 font-semibold">Condition: {book.condition}</p>

          <div className="flex items-center gap-1">
            {book.averageRating !== undefined && (
              <div className="flex items-center text-yellow-500 mb-1 gap-0.5 text-base">
                {Array.from({ length: 5 }, (_, i) =>
                  i < Math.round(book.averageRating!) ? (
                    <FaStar key={i} />
                  ) : (
                    <FaRegStar key={i} />
                  )
                )}
                <span className="ml-2 font-semibold text-[#4A4947]">
                  {book.averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {book.availableFor.includes('sell') && (
            <p className="text-2xl font-bold text-[#a8775a]">${book.price?.toFixed(2)}</p>
          )}

          <p className="text-sm text-gray-700 leading-relaxed">
            {book.description}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            {book.availableFor.includes('sell') && (
              <button 
                onClick={() => addToCart({
                  bookId: book.id,
                  title: book.title,
                  author: book.author,
                  coverImage: book.coverImage,
                  price: book.price!,
                  quantity: 1
                })} 
                className="bg-btn-color text-[15px] hover:bg-[#a16950] text-gray-50 py-2 px-4 rounded-full transition duration-300">
                Add to Cart
              </button>
            )}
            {book.availableFor.includes('swap') && (
              <button className="bg-btn-color text-[15px] hover:bg-[#a16950] text-gray-50 py-2 px-4 rounded-full transition duration-300">
                Exchange request
              </button>
            )}
          </div>
        </div>
      </div>
      <div className='flex flex-col lg:flex-row gap-10 pb-16 container mx-auto px-20'>
        <ReviewSection targetId={book.id} currentUserId={user!.uid} type="book"/>
        <ReviewSection targetId={book.ownerId} targetUser={bookOwner} currentUserId={user!.uid} type="user"/>
      </div>
      <Footer />
    </>
  );
}
