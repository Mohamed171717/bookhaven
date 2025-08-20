
'use client'
import { useEffect, useState } from 'react'
import ShopFilterSidebar from './ShopFilterSidebar'
import ShopBookGrid from './ShopBookGrid'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { HiFilter } from 'react-icons/hi'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/context/AuthContext'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import toast from 'react-hot-toast'

export default function ShopPage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAvilable, setSelectedAvilable] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const booksPerPage = 6;
  const t = useTranslations('ShopPage');
  const { user } = useAuth();

  useEffect(() => {
    const out = async () => {
      if (user?.isBanned === true ) {
        await signOut(auth);
        toast.error('Your account has been banned.');
        return; // Stop further execution
      }
    }
    out();
  },[user])

  useEffect(() => {
    setCurrentPage(1);
  },[selectedGenres, selectedPriceRanges, selectedAvilable]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header />
      <div className="fix-height pt-[155px] pb-10 container mx-auto px-4 md:px-8 lg:px-20">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-2 bg-primary-color text-white px-4 py-2 rounded-lg hover:bg-[#a16950] transition-colors"
          >
            <HiFilter className="text-lg" />
              {t('filter')}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar - Mobile Overlay */}
          {isSidebarOpen && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar}>
              <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{t('filter')}</h2>
                  <button
                    onClick={toggleSidebar}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
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
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex lg:flex-col w-1/4 gap-4">
            <h2 className="text-xl md:text-2xl font-semibold">{t('filter')}</h2>
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

          {/* Main Content */}
          <main className="w-full lg:w-3/4 flex flex-col gap-4">
            <h2 className="text-xl md:text-2xl font-semibold">{t('shop')}</h2>
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
