
import React from 'react'

type BookDetails = {
  title: string,
  description?: string,
  author: string,
  price: string,

}
const BookCardWithFlex = (props: BookDetails) => {
  return (
    <>
    <div className="bg-white rounded-lg flex shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="h-100 flex-1 bg-[url('/images/2.png')] bg-cover bg-gray-200 flex items-center justify-center">
      </div>
      <div className="p-6 flex-1">
        <h3 className="text-xl font-bold primary-color mb-1">{props.title}</h3>
        <p className="text-gray-600 mb-2">{props.author}</p>
        <p className="text-gray-700 mb-4">{props.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-[16px] font-semibold text-[#915f48]">{props.price}</span>
          <button className="bg-btn-color text-[15px] hover:bg-[#a16950] text-gray-50 py-2 px-4 rounded-full transition duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default BookCardWithFlex