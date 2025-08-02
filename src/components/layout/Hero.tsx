"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/images/cover.jpg",
    title: "Discover Your Next Great Read",
    subtitle:
      "Browse thousands of books at unbeatable prices. From bestsellers to rare finds, your perfect book awaits.",
    buttonLabel: "Explore Books",
    buttonLink: "/shop",
  },
  {
    id: 2,
    image: "/images/cover2.png",
    title: "Build Your Personal Library",
    subtitle: "Buy, sell, and swap books you love with others",
    buttonLabel: "Start Trading",
    buttonLink: "/profile",
  },
  {
    id: 3,
    image: "/images/cover3-1.png",
    title: "Connect with community",
    subtitle: "Join our Community and Share your thoughts with other people",
    buttonLabel: "See Community",
    buttonLink: "/community",
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[93vh] overflow-hidden">
      {/* Slides container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="flex-shrink-0 w-full h-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
            <div className="relative z-10 container mx-auto h-full px-4 text-center flex flex-col justify-center items-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {slide.title}
              </h1>
              <p className="text-xl text-white mb-8">{slide.subtitle}</p>
              <Link
                href={slide.buttonLink}
                className="bg-btn-color hover:bg-[#a16950] text-white font-semibold py-3 px-8 rounded-full transition duration-300"
              >
                {slide.buttonLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
            title={`Go to slide ${index + 1}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white text-3xl z-10"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-3xl z-10"
      >
        ›
      </button>
    </section>
  );
};

export default Hero;
