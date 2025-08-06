"use client";
import BookCard from "@/components/BookCard";
import { FadeBoxCard, FadeBoxCardWithFlex, FadePostCard } from "@/components/animations/FadeInWrapper";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import LanguageSwitcher from "@/components/layout/languageSwitcher";
import BookCardWithFlex from "@/components/BookCardWithFlex";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import { useBooks } from "@/context/BooksContext";
import { db } from "@/lib/firebase";
import { PostType } from "@/types/PostType";
import { useEffect, useState } from "react";
import PostCard from "./community/PostCard";
import Link from "next/link";
import { useTranslations } from "next-intl";


export default function HomePage() {
  const { books, loading } = useBooks();
  const [posts, setPosts] = useState<PostType[]>([]);
  const t = useTranslations("HomePage");

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        postId: doc.id,
      })) as PostType[];

      setPosts(data);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  if (!loading) {
    console.log(books);
  }

  // top rated books
  const TOP_RATED_BOOKS = books
    .filter((book) => {
      if (book.averageRating && book.availableFor.includes("sell"))
        return book.averageRating >= 4;
    })
    .sort((a, b) => {
      const ratingA = a.averageRating ?? 0;
      const ratingB = b.averageRating ?? 0;
      return ratingB - ratingA;
    });

  console.log(TOP_RATED_BOOKS);

  //newest books
  const newestBooks = [...books].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      <Header />
      <LanguageSwitcher />
      <main className="min-h-screen pt-[37px]">
        {/* Hero Section */}
        <Hero />
        {/* Best Selling Books */}
        <section className="py-8 md:py-16 container mx-auto px-4 md:px-8 lg:px-20">
          <h2 className="text-2xl md:text-3xl font-bold primary-color mb-6 md:mb-8">
            {t('best')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {TOP_RATED_BOOKS.slice(0, 4).map((book, index) => (
              <FadeBoxCard key={book.id} delay={index * 0.5}>
                <BookCard
                  id={book.id}
                  availableFor={book.availableFor}
                  bookImg={book.coverImage}
                  title={book.title}
                  description={book.description}
                  author={book.author}
                  price={book.price}
                />
              </FadeBoxCard>
            ))}
          </div>
        </section>

        {/* our community */}
        <section className="py-8 md:py-16 bg-card-color">
          <div className="container mx-auto px-4 md:px-8 lg:px-20">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
              {t('blog')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {posts && posts.slice(0, 4).map((post, index) => {
                if (post.content == "") return;
                return (
                  <FadePostCard key={post.postId} delay={index * 0.5} direction={"right"}>
                    <PostCard post={post} showComment={true} />
                  </FadePostCard>
                );
              })}
            </div>
            <div className="text-center mt-6 md:mt-8">
              <Link
                href="/community"
                className="bg-primary-color hover:bg-[#a16950] text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-full transition duration-300 text-sm md:text-base"
              >
                {t('viewAll')}
              </Link>
            </div>
          </div>
        </section>

        {/* New arrivals */}
        <section className="py-8 md:py-16 container mx-auto px-4 md:px-8 lg:px-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
            {t('new')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {newestBooks.slice(0, 2).map((book) => (
              <FadeBoxCardWithFlex key={book.id} delay={0.5} direction={"down"}>
                <BookCardWithFlex
                  id={book.id}
                  availableFor={book.availableFor}
                  bookImg={book.coverImage}
                  title={book.title}
                  description={book.description}
                  author={book.author}
                  price={book.price}
                />
              </FadeBoxCardWithFlex>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-8 md:py-16 bg-card-color text-gray-50">
          <div className="container mx-auto px-4 md:px-8 lg:px-20 text-center">
            <h2 className="text-2xl md:text-3xl primary-color font-bold mb-4">
              {t('newsletter')}
            </h2>
            <p className="text-base md:text-xl primary-color mb-6 md:mb-8">
              {t('newsletterDescription')}
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder={t('emailPlaceholder') || "Enter your email"}
                className="flex-grow px-4 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-gray-800 focus:outline-none"
              />
              <button className="bg-primary-color hover:bg-[#a16950] font-semibold py-3 px-6 rounded-lg sm:rounded-l-none sm:rounded-r-lg transition duration-300 text-sm md:text-base">
                {t('subscribe')}
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
