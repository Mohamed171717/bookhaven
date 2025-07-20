

import React from 'react'

const Hero = () => {
  return (
    <>
    <section className="relative bg-[url('/images/cover.jpg')] bg-cover h-[600px] bg-center flex items-center justify-center bg-no-repeat">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      {/* Content layout */}
      <div className="z-10 relative container mx-auto px-4 text-center p-6 rounded-md">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-50 mb-4">
          Discover, Trade, and Share Stories
        </h1>
        <p className="text-xl text-gray-50 mb-8">
          Join our community of book lovers and find your next favorite read
        </p>
        <button className="bg-btn-color hover:bg-[#a16950] text-gray-50 font-semibold py-3 px-8 rounded-full transition duration-300">
          Explore Books
        </button>
      </div>
    </section>
    </>
  )
}

export default Hero







