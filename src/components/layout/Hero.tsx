"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonLink: string;
}


const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();
  const t = useTranslations("HomePage");

  // Auto-slide functionality
  const slides: Slide[] = [
    {
      id: 1,
      image: "/images/cover.jpg",
      title: t('discover'),
      subtitle: t('browse'),
      buttonLabel: t('explore'),
      buttonLink: "/shop",
    },
    {
      id: 2,
      image: "/images/cover2.png",
      title: t('build'),
      subtitle: t('buy'),
      buttonLabel: t('start'),
      buttonLink: user ? "/profile" : "/auth",
    },
    {
      id: 3,
      image: "/images/cover3-1.png",
      title: t('connect'),
      subtitle: t('join'),
      buttonLabel: t('see'),
      buttonLink: user ? "/community" : "/auth",
    },
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[85vh] md:h-[93vh] overflow-hidden">
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
            <div className="relative z-10 container mx-auto h-full px-4 md:px-8 text-center flex flex-col justify-center items-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-6 md:mb-8 px-4 max-w-2xl">
                {slide.subtitle}
              </p>
              <Link
                href={slide.buttonLink}
                className="bg-btn-color hover:bg-[#a16950] text-white font-semibold py-2 px-6 md:py-3 md:px-8 rounded-full transition duration-300 text-sm md:text-base"
              >
                {slide.buttonLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
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
        className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 text-white text-2xl md:text-3xl z-10 hover:bg-black hover:bg-opacity-30 rounded-full p-1 transition-all"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 text-white text-2xl md:text-3xl z-10 hover:bg-black hover:bg-opacity-30 rounded-full p-1 transition-all"
      >
        ›
      </button>
    </section>
  );
};

export default Hero;
