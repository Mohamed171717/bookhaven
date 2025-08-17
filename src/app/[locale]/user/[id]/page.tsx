"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BookType } from "@/types/BookType";
import { PostType } from "@/types/PostType";
import PostCard from "../../community/PostCard";
import { UserType } from "@/types/UserType";
import toast from "react-hot-toast";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import Link from "next/link";

export default function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<UserType | null>(null);
  const [books, setBooks] = useState<BookType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [activeTab, setActiveTab] = useState<"books" | "posts">("books");
  const [loading, setLoading] = useState(true);

  const breakpointColumnsObj = {
    default: 2,
    1280: 2,
    768: 1,
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id) return;

      try {
        // Fetch user data
        const userDoc = await getDoc(doc(db, "users", id as string));
        if (!userDoc.exists()) {
          toast.error("User not found");
          return;
        }
        setUser({ ...(userDoc.data() as UserType), uid: userDoc.id });

        // Fetch user's books
        const booksQuery = query(
          collection(db, "books"),
          where("ownerId", "==", id),
          where("isDeleted", "==", false),
          where("approval", "==", "approved")
        );
        const booksSnapshot = await getDocs(booksQuery);
        const userBooks = booksSnapshot.docs.map((doc) => ({
          ...(doc.data() as BookType),
          id: doc.id,
        }));
        setBooks(userBooks);

        // Fetch user's posts
        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", id)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const userPosts = postsSnapshot.docs.map((doc) => ({
          ...(doc.data() as PostType),
          postId: doc.id,
        }));
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) return null;
  if (!user) return <div>User not found</div>;

  return (
    <>
      <Header />
      <div className="max-w-7xl px-4 md:px-6 pb-6 pt-[100px] md:pt-[150px] xl:pt-[180px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Sidebar */}
        <div className="col-span-1 space-y-4 md:space-y-6">
          {/* Profile Card */}
          <div className="bg-card-bg border p-6 md:p-8 rounded-lg shadow-md text-center">
            <Image
              width={900}
              height={900}
              src={user.photoUrl || "/user-default.jpg"}
              alt="profile"
              className="rounded-full w-[100px] h-[100px] mx-auto mb-4 md:w-[140px] md:h-[140px]"
            />
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              {user.name}
            </h2>
            <p className="text-sm md:text-base text-gray-500 mb-3">
              {user.email}
            </p>

            {user.averageRating !== undefined && (
              <div className="flex w-[90px] m-auto my-3 items-center gap-1">
                <div className="flex items-center text-yellow-500 mb-1 gap-0.5 text-base md:text-lg">
                  {Array.from({ length: 5 }, (_, i) =>
                    i < Math.round(user.averageRating!) ? (
                      <FaStar key={i} />
                    ) : (
                      <FaRegStar key={i} />
                    )
                  )}
                </div>
              </div>
            )}

            <p className="mt-3 text-sm md:text-base text-gray-600 mb-4">
              {user.bio}
            </p>

            {user.role === "library" && user.address && (
              <p className="text-sm md:text-base text-gray-600 mb-4">
                Address: {user.address}
              </p>
            )}
          </div>

          {/* Favorite Genres */}
          {user.role === "reader" && user.genres && (
            <div className="bg-card-bg border p-6 md:p-8 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-800 mb-4 md:mb-6 text-base md:text-lg">
                Favorite Genres
              </h3>
              <div className="flex flex-wrap gap-3">
                {user.genres.map((genre, i) => (
                  <span
                    key={i}
                    className="bg-[#a8775a]/20 text-[#a8775a] px-3 py-2 rounded-full text-sm md:text-base font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex space-x-4 border-b">
            <button
              className={`pb-2 px-4 ${
                activeTab === "books"
                  ? "border-b-2 border-[#a8775a] text-[#a8775a]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("books")}
            >
              Books
            </button>
            <button
              className={`pb-2 px-4 ${
                activeTab === "posts"
                  ? "border-b-2 border-[#a8775a] text-[#a8775a]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>
          </div>

          {/* Content */}
          {activeTab === "books" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 px-8">
              {books.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center">
                  No books available
                </p>
              ) : (
                books.map((book) => (
                  <Link href={`/shop/${book.id}`} key={book.id}>
                    <div className="bg-card-bg border rounded-lg shadow-md">
                      <Image
                        src={book.coverImage}
                        width={600}
                        height={48}
                        alt={book.title}
                        className="rounded-t w-full h-[220px] md:h-[280px] mb-4 object-cover"
                      />
                      <div className="p-3 md:p-4">
                        <h4 className="font-semibold text-gray-800 text-sm md:text-base mb-2 overflow-hidden">
                          {book.title.length >= 25
                            ? `${book.title.slice(0, 25)}...`
                            : book.title}
                        </h4>
                        <p className="text-sm md:text-base text-gray-500 mb-3">
                          {book.author}
                        </p>
                        {book.availableFor.includes("sell") && (
                          <div className="text-[#a8775a] text-sm md:text-base font-semibold mb-3">
                            E£{book.price}
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="bg-green-100 px-3 py-1 rounded text-sm font-medium">
                            {book.condition}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {book.availableFor.join(" / ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-gray-500 text-center">No posts available</p>
          ) : (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post.postId}
                  initial={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <PostCard post={post} showComment={true} />
                </motion.div>
              ))}
            </Masonry>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
