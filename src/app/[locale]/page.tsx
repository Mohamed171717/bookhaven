"use client";
import BookCard from "@/components/BookCard";
import BookCardWithFlex from "@/components/BookCardWithFlex";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import { useBooks } from "@/context/BooksContext";

export default function HomePage() {
  const { books, loading } = useBooks();

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
      <main className="min-h-screen">
        {/* Hero Section */}
        <Hero />
        {/* Best Selling Books */}
        <section className="py-16 container mx-auto px-20">
          <h2 className="text-3xl font-bold primary-color mb-8">
            Top Rated Books
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TOP_RATED_BOOKS.slice(0, 4).map((book) => (
              <BookCard
                key={book.id}
                title={book.title}
                description={book.description}
                author={book.author}
                price={book.price}
              />
            ))}
          </div>
        </section>

        {/* Trending in Books */}
        <section className="py-16 bg-secondary-color">
          <div className="container mx-auto px-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Recent Books
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {newestBooks.slice(0, 4).map((book) => (
                <BookCard
                  key={book.id}
                  title={book.title}
                  description={book.description}
                  author={book.author}
                  price={book.price}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Fresh Off the Press */}
        <section className="py-16 container mx-auto px-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Fresh Off the Press
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BookCardWithFlex
              title="The Library Book"
              author="Susan Orlean"
              description="A fascinating journey through the history of libraries"
              price="$25.99"
            />
            <BookCardWithFlex
              title="The Midnight Library"
              author="Matt Haig"
              description="A story about infinite possibilities in the universe that are impossible"
              price="$23.99"
            />
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-secondary-color text-gray-50">
          <div className="container mx-auto px-20 text-center">
            <h2 className="text-3xl primary-color font-bold mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-xl primary-color mb-8">
              Stay updated with our latest arrivals and special offers
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none"
              />
              <button className="bg-primary-color hover:bg-[#a16950] font-semibold py-3 px-6 rounded-r-lg transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
