
'use client'
// import { useEffect, useState } from 'react'
import ShopFilterSidebar from './ShopFilterSidebar'
import ShopBookGrid from './ShopBookGrid'
import SortDropdown from './SortDropdown'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ShopPage() {

  return (
    <>
      <Header />
      <div className="min-h-screen py-16 container mx-auto px-20">
        <div className="flex gap-4 p-4 ">
          <aside className="w-1/4">
            <ShopFilterSidebar/>
          </aside>
          <main className="w-3/4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Shop Books</h2>
              <SortDropdown />
            </div>
            <ShopBookGrid />
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}
