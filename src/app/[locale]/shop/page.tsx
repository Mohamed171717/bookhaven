
'use client'
import { useEffect, useState } from 'react'
import ShopFilterSidebar from './ShopFilterSidebar'
import ShopBookGrid from './ShopBookGrid'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LanguageSwitcher from '@/components/layout/languageSwitcher'

export default function ShopPage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAvilable, setSelectedAvilable] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  },[selectedGenres, selectedPriceRanges, selectedAvilable]);


  return (
    <>
      <Header />
      <LanguageSwitcher />
      <div className="min-h-screen pt-[140px] pb-16 container mx-auto px-20">
        <div className="flex gap-8 p-4">
          <aside className="w-1/4 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Filters</h2>
            <ShopFilterSidebar 
              selectedGenres={selectedGenres}
              selectedPriceRanges={selectedPriceRanges}
              selectedAvilable={selectedAvilable}
              selectedCondition={selectedCondition}
              setSelectedCondition={setSelectedCondition}
              setSelectedGenres={setSelectedGenres}
              setSelectedPriceRanges={setSelectedPriceRanges}
              setSelectedAvilable={setSelectedAvilable}
            />
          </aside>
          <main className="w-3/4 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Shop Books</h2>
            <ShopBookGrid
              selectedGenres={selectedGenres}
              selectedPriceRanges={selectedPriceRanges}
              selectedAvilable={selectedAvilable}
              selectedCondition={selectedCondition}
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
