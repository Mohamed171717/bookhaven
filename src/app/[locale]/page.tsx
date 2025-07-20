
import BookCard from "@/components/BookCard";
import BookCardWithFlex from "@/components/BookCardWithFlex";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";


export default function HomePage() {
  return (
    <>
    <Header />
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero/>
      {/* Best Selling Books */}
      <section className="py-16 container mx-auto px-20">
        <h2 className="text-3xl font-bold primary-color mb-8">Best Selling Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <BookCard
            title="The Midnight Library"
            author="Matt Haig"
            price="$24.99"
          />
          <BookCard 
            title="The Silent Patient"
            author="Alex Michaelides"
            price="$19.99"
          />
          <BookCard 
            title="The Seven Husbands"
            author="Taylor Jenkins Reid"
            price="$22.99"
          />
          <BookCard 
            title="Tomorrow"
            author="Gabrielle Zevin"
            price="$21.99"
          />
        </div>
      </section>

      {/* Trending in Books */}
      <section className="py-16 bg-secondary-color">
        <div className="container mx-auto px-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Trending in Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BookCard 
              title="The Invisible Life"
              author="V.E. Schwab"
              price="$23.99"
            />
            <BookCard 
              title="The Paris Apartment"
              author="Lucy Foley"
              price="$20.99"
            />
            <BookCard 
              title="The Last Thing He Told Me"
              author="Laura Dave"
              price="$22.99"
            />
            <BookCard 
              title="The Guest List"
              author="Lucy Foley"
              price="$21.99"
            />
          </div>
        </div>
      </section>

      {/* Fresh Off the Press */}
      <section className="py-16 container mx-auto px-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Fresh Off the Press</h2>
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
          <h2 className="text-3xl primary-color font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-xl primary-color mb-8">Stay updated with our latest arrivals and special offers</p>
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
  )
}






