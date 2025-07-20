
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { BookType } from '@/types/BookType'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'

export default function BookDetailsPage() {
  const { id } = useParams()
  const [book, setBook] = useState<BookType | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchBook = async () => {
      const q = query(collection(db, 'books'), where('id', '==', id))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        setBook(doc.data() as BookType)
      }
    }
    if (id) fetchBook()
  }, [id])

  if (!book) {
    return <div className="text-center py-20">Loading book details...</div>
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Book Image */}
          <div className="w-full lg:w-1/2">
            <div className="border rounded-2xl overflow-hidden">
              <Image
                src={book.coverImage || '/book-placeholder.jpg'}
                alt={book.title}
                width={500}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold">{book.title}</h1>
            <p className="text-lg text-gray-600">by {book.author}</p>
            <p className="text-sm text-gray-500">Genre: {book.genre}</p>
            <p className="text-sm text-gray-500">Condition: {book.condition}</p>
            <p className="text-gray-700 mt-2">{book.description}</p>

            {book.availableFor.includes('sell') && (
              <p className="text-2xl font-bold text-green-600">${book.price?.toFixed(2)}</p>
            )}

            {/* Quantity Selector */}
            {book.availableFor.includes('sell') && (
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 border rounded"
                >
                  −
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-8 h-8 border rounded"
                >
                  +
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {book.availableFor.includes('sell') && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl">
                  Add to Cart
                </button>
              )}
              {book.availableFor.includes('swap') && (
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl">
                  Request Swap
                </button>
              )}
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
