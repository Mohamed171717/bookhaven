"use client";
import BookCard from "@/components/BookCard";
import { FadeBoxCard, FadeBoxCardWithFlex, FadePostCard } from "@/components/animations/FadeInWrapper";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
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
import { useAuth } from "@/context/AuthContext";
import ComplaintSection from "@/components/ComplainSection";


export default function HomePage() {
  const { books, loading } = useBooks();
  const { user } = useAuth();
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
      <main>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left side: One post */}
              {posts && posts[0] && posts[0].content !== "" && (
                <FadePostCard delay={0.5} direction={"right"}>
                  <PostCard post={posts[0]} showComment={true} />
                </FadePostCard>
              )}

              {/* Right side: Text + button */}
              { user ? (
                <div className="flex flex-col text-center justify-center">
                <p className="text-gray-700 text-2xl font-bold mb-4 md:mb-6">
                  {t('blogDescription') || "Stay updated with our latest community news, insights, and stories from our members."}
                </p>
                <Link
                  href="/community"
                  className="bg-primary-color m-auto hover:bg-[#a16950] text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-full transition duration-300 text-sm md:text-base inline-block w-max"
                >
                  {t('viewAll')}
                </Link>
              </div>
              ) : (
                <div className="flex flex-col text-center justify-center">
                  <p className="text-gray-700 text-2xl font-bold mb-4 md:mb-6">
                    {t('join')}
                  </p>
                  <Link
                    href="/auth"
                    className="bg-primary-color m-auto hover:bg-[#a16950] text-white font-semibold py-1 px-4 md:py-2 md:px-6 rounded-full transition duration-300 text-sm md:text-base inline-block w-max"
                  >
                    {t('joincommunity')}
                  </Link>
                </div>
              )}
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
        <ComplaintSection />
      </main>
      <Footer />
    </>
  );
}
