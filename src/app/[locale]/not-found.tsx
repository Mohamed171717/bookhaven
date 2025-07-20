
"use client";
import Link from 'next/link';
import React from 'react'

const NotFound = () => {
  return (
    <section className="flex items-center h-screen p-4 bg-white">
      <div className="container mx-auto text-center">
        <div className="relative w-full h-[700px] bg-center bg-cover" style={{ backgroundImage: "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')" }}>
          <h1 className="text-8xl font-bold text-center primary-color absolute left-[50%] translate-x-[-50%] bottom-0 flex items-center justify-center">
            404
          </h1>
        </div>

        <div className="mt-[40px]">
          <h2 className="text-2xl font-semibold mb-4">Look like you`re lost</h2>
          <p className="text-gray-600 mb-6">The page you are looking for is not available!</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 text-white bg-primary-color hover:bg-[#382c2cdd] rounded transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NotFound;