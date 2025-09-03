"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CiSearch } from "react-icons/ci";
import { FaShoppingCart } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ChatIcon } from "../chat/ChatIcon";
import { useState, useEffect, useRef } from "react";
import { useBooks } from "@/context/BooksContext";
import { useRouter } from "next/navigation";
import { BookType } from "@/types/BookType";
import LanguageSwitcher from "./languageSwitcher";
import { useTranslations } from "next-intl";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function Header() {
  const { user, loading } = useAuth();
  const t = useTranslations('HomePage');
  const l = useTranslations('LoginPage');
  const { cart } = useCart();
  const { books } = useBooks();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);


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

  // Filter books based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = books
      .filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 results

    setFilteredBooks(filtered);
    setShowSearchResults(filtered.length > 0);
  }, [searchQuery, books]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return null;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleBookClick = (bookId: string) => {
    setSearchQuery("");
    setShowSearchResults(false);
    router.push(`/shop/${bookId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredBooks.length > 0) {
      handleBookClick(filteredBooks[0].id);
    }
  };

  return (
    <header style={{width: '100%', position: 'fixed'}} className="bg-white z-30 px-4 py-2 md:py-4 xl:py-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-baseline gap-4 md:gap-16">
          <Link href="/" className="text-2xl md:text-3xl font-bold primary-color">
            <Image src={"/logo.png"} alt="Book Haven Logo" width={120} height={120} className="inline-block mr-2" />
          </Link>
          {/* Desktop Navigation - Only show on 2xl screens and above (1440px) */}
          <nav className="hidden 2xl:flex gap-5 items-baseline text-xl font-medium text-gray-700">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              {t('home')}
            </Link>
            <Link href="/shop" className="hover:text-gray-900 transition-colors">
              {t('shop')}
            </Link>
            { user ? (
              <>
              <Link href="/community" className="hover:text-gray-900 transition-colors">
                {t('community')}
              </Link>
              <Link href="/support" className="hover:text-gray-900 transition-colors">
                {t('support')}
              </Link>
              </>
            ) : (
              <>
              <Link href="/auth" className="hover:text-gray-900 transition-colors">
                {t('community')}
              </Link>
              <Link href="/auth" className="hover:text-gray-900 transition-colors">
                {t('support')}
              </Link>
              </>
            )}
            <div className="hover:text-gray-900 transition-colors">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>

        {/* Right: Search + Auth */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Bar */}
          <div className="relative hidden sm:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder={t('searchPlaceholder') || "Search books..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-10 py-1 md:py-2 rounded-full bg-card-bg border placeholder-gray-600 text-sm md:text-lg text-gray-800 outline-none w-32 sm:w-48 md:w-80"
              />
              <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-700">
                <CiSearch />
              </button>
            </form>
            
            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book.id)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      width={40}
                      height={50}
                      className="rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {book.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        by {book.author}
                      </p>
                      {book.price ? (
                        <p className="text-xs font-medium text-primary-color">
                          {book.price.toFixed(2)} EGP
                        </p>
                      ) : (<p></p>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* login or profile */}
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/cart" className="relative">
                <FaShoppingCart className="text-xl md:text-2xl color-primary hover:text-[#3d3c3b] cursor-pointer" />
                {cart.length > 0 && (
                  <span className="w-4 h-4 absolute -top-1 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                    {cart.length}
                  </span>
                )}
              </Link>
              <ChatIcon />
              <Link href={`/profile`}>  
                <Image
                  width={50}
                  height={50}
                  src={user.photoUrl || "/user-default.jpg"}
                  alt="User Avatar"
                  style={{ border: "1px solid gray" }}
                  className="rounded-full w-8 h-8 md:w-10 md:h-10"
                />
              </Link>
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-1 md:py-2 rounded-full border text-gray-50 bg-primary-color hover:bg-[#b17457] transition"
            >
              {l('login')}
            </Link>
          )}

          {/* Mobile Menu Button - Only show on screens smaller than 2xl (1440px) */}
          <button
            onClick={toggleMobileMenu}
            className="2xl:hidden p-2 text-gray-700 hover:text-gray-900"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <HiX className="text-2xl" />
            ) : (
              <HiMenu className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Only show on screens smaller than 2xl (1440px) */}
      {isMobileMenuOpen && (
        <div className="2xl:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-full bg-gray-100 placeholder-gray-600 text-gray-800 outline-none"
                />
                <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-700">
                  <CiSearch />
                </button>
              </form>
              
              {/* Mobile Search Results */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => handleBookClick(book.id)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        width={40}
                        height={50}
                        className="rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {book.title}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          by {book.author}
                        </p>
                        {book.price && (
                          <p className="text-xs font-medium text-primary-color">
                            {book.price.toFixed(2)} EGP
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Mobile Navigation Links */}
            <nav className="space-y-3">
              <Link 
                href="/" 
                className="block py-2 text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link 
                href="/shop" 
                className="block py-2 text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('shop')}
              </Link>
              {/* old */}
              { user ? (
              <>
                <Link 
                  href="/community" 
                  className="block py-2 text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('community')}
                </Link>
                <Link 
                  href="/support" 
                  className="block py-2 text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('support')}
                </Link>
              </>
              ) : (
                <>
                  <Link 
                    href="/auth" 
                    className="block py-2 text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('community')}
                  </Link>
                  <Link 
                    href="/auth" 
                    className="block py-2 text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('support')}
                  </Link>
                </>
              )}
              <div className="hover:text-gray-900 transition-colors">
                <LanguageSwitcher />
              </div>
            </nav>
            
          </div>
        </div>
      )}
    </header>
  );
}
