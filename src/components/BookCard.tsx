
import React from 'react'

type BookDetails = {
  title: string,
  description?: string,
  author: string,
  price: string,

}

const BookCard = (props: BookDetails) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="h-48 bg-[url('/images/1.png')] flex items-center justify-center">
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold primary-color mb-1">{props.title}</h3>
        <p className="text-gray-600 mb-4">{props.author}</p>
        <div className="flex justify-between items-center">
          <span className="text-[16px] font-semibold text-[#915f48]">{props.price}</span>
          <button className="bg-btn-color text-[15px] hover:bg-[#a16950] text-gray-50 py-2 px-4 rounded-full transition duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookCard