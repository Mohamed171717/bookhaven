"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CiSearch } from "react-icons/ci";
import LanguageSwitcher from "./languageSwitcher";
import { FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import { ChatIcon } from "../chat/ChatIcon";

export default function Header() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <header className="bg-[#fdfaf3] px-6 py-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-baseline gap-16">
          <Link href="/" className="text-2xl font-bold primary-color">
            BookHaven
          </Link>
          <nav className="hidden md:flex gap-5 items-baseline font-medium text-gray-700">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <Link href="/shop" className="hover:text-gray-900">
              Shop
            </Link>
            <Link href="/trade" className="hover:text-gray-900">
              Trade
            </Link>
            <Link href="/swap" className="hover:text-gray-900">
              Swap
            </Link>
            <Link href="/about" className="hover:text-gray-900">
              About
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>

        {/* Right: Search + Auth */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search books..."
              className="pl-4 pr-10 py-3 rounded-full bg-[#dad3c1] placeholder-gray-600 text-sm text-gray-800 outline-none w-48 sm:w-80"
            />
            <span className="absolute right-4 top-3.5 text-lg text-gray-700">
              <CiSearch />
            </span>
          </div>
          {/* login or profile */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative">
                <FaShoppingCart className="text-xl color-primary hover:text-[#3d3c3b] cursor-pointer" />
                <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                  4
                </span>
              </Link>
              <ChatIcon />
              <Link href="/profile">
                <Image
                  width={35}
                  height={35}
                  src={user.photoUrl || "/user-default.jpg"}
                  alt="User Avatar"
                  style={{ border: "1px solid gray" }}
                  className="rounded-full"
                />
              </Link>
            </div>
          ) : (
            <Link
              href="/auth"
              className="py-1.5 px-4 rounded-md text-sm font-medium bg-primary-color text-white hover:bg-gray-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
