
'use client'
import { useEffect, useState } from 'react'
import ShopFilterSidebar from './ShopFilterSidebar'
import ShopBookGrid from './ShopBookGrid'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ShopPage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  },[selectedGenres, selectedPriceRanges])


  return (
    <>
      <Header />
      <div className="min-h-screen py-16 container mx-auto px-20">
        <div className="flex gap-4 p-4">
          <aside className="w-1/4 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Filters</h2>
            <ShopFilterSidebar 
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
              selectedPriceRanges={selectedPriceRanges}
              setSelectedPriceRanges={setSelectedPriceRanges}
            />
          </aside>
          <main className="w-3/4 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Shop Books</h2>
            <ShopBookGrid
              selectedGenres={selectedGenres}
              selectedPriceRanges={selectedPriceRanges}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              booksPerPage={booksPerPage}
            />
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}
