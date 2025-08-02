"use client";

import Image from 'next/image';
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { FaBell, FaRegStar, FaStar } from 'react-icons/fa';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import EditProfileModal from '@/components/EditProfileModal';
import { logoutUser } from '@/lib/authService';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AddBookModal from '@/components/AddBookForm';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BookType } from '@/types/BookType';
import EditBookModal from '@/components/EditBookModal';
import { useTransactionContext } from '@/context/TransactionContext';
import TransactionTabs from '@/components/TransactionTab';
import LanguageSwitcher from '@/components/layout/languageSwitcher';
// import { Transaction } from '@/types/TransactionType';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, setUser } = useAuth();
  const [openEdit, setOpenEdit] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [books, setBooks] = useState<BookType[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { transactions } = useTransactionContext();

  useEffect(() => {
    if (!user?.uid) return;
    // fetch books
    const fetchBooks = async () => {
      try {
        const q = query(
          collection(db, "books"),
          where("ownerId", "==", user.uid),
          where("isDeleted", "==", false)
        );

        const snapshot = await getDocs(q);
        const userBooks = snapshot.docs.map((doc) => ({
          ...(doc.data() as BookType),
          id: doc.id,
        }));
        setBooks(userBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, [user]);
  
  // handle delete book
  const handleDeleteBook = async (bookId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmDelete) return;

    try {
      const ref = doc(db, "books", bookId);
      await updateDoc(ref, {
        isDeleted: true,
        updatedAt: new Date(),
      });
      toast.success("Book deleted successfully");
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete book");
    }
  };

  const notifications = [
    {
      id: 1,
      message: "New trade offer for 'Pride and Prejudice'",
      time: "2 hours ago",
    },
    {
      id: 2,
      message: "Message from John regarding 'The Great Gatsby'",
      time: "5 hours ago",
    },
    {
      id: 3,
      message: "Your book listing was viewed 12 times",
      time: "1 day ago",
    },
    { id: 4, message: "Trade completed with Emma", time: "2 days ago" },
  ];

  // handle logout
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?")
    if (!confirmLogout) return

    try {
      await logoutUser()
      toast.success("Logged out successfully")
      router.push("/")
    } catch (error) {
      console.error(error)
      toast.error("Failed to logout")
    }
  }

  if (loading || !user) return null;

  return (
    <>
    <Header/>
    <LanguageSwitcher />
    <div className="max-w-7xl px-6 pb-6 pt-[155px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Sidebar */}
      <div className="col-span-1 mt-14 space-y-6">
        {/* Profile Card */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
          <Image width={120} height={120} src={ user.photoUrl || '/user-default.jpg'} alt="profile" className="rounded-full mx-auto mb-3" />
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="flex w-[90px] m-auto my-3 items-center gap-1">
            {user.averageRating !== undefined && (
              <div className="flex items-center text-yellow-500 mb-1 gap-0.5 text-base">
                {Array.from({ length: 5 }, (_, i) =>
                  i < Math.round(user.averageRating!) ? (<FaStar key={i} />) : (<FaRegStar key={i} />)
                )}
              </div>
            )}
          </div>
          <p className="mt-3 text-sm text-gray-600">{user.bio}</p>
          <button 
            className="mt-4 px-4 py-2 mr-3 rounded-full bg-[#a8775a] text-white hover:bg-[#946a52]"
            onClick={() => setOpenEdit(true)}
          >  
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 ml-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          {/* Popup for edit profile */}
          {openEdit && (
            <EditProfileModal
              onClose={() => setOpenEdit(false)}
              onUpdate={(updatedUser) => {
                setUser(updatedUser);
                setOpenEdit(false);
              }}
            />
          )}

          {/* Favorite Genres */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-800 mb-4">
              Favorite Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.genres.map((genre, i) => (
                <span
                  key={i}
                  className="bg-[#a8775a]/20 text-[#a8775a] px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">
                Recent Notifications
              </h3>
              <FaBell className="text-gray-600" />
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              {notifications.map((note) => (
                <li key={note.id} className="border-l-4 border-[#a8775a] pl-2">
                  <p>{note.message}</p>
                  <span className="text-xs text-gray-400">{note.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-2 space-y-8">
          {/* Books for Sale/Trade */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Your Books for Sale/Exchange
              </h3>
              <button
                className="bg-[#a8775a] text-white px-4 py-2 rounded-full hover:bg-[#946a52]"
                onClick={() => setShowAddBook(true)}
              >
                + Add New Book
              </button>
            </div>
            {/* add book popup */}
            {showAddBook && (
              <AddBookModal
                onClose={() => setShowAddBook(false)}
                onAdd={(addedBook) => {
                  setBooks((prevBooks) => [...prevBooks, addedBook]);
                  setShowAddBook(false);
                }}
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {books.map((book) => (
                <div key={book.id} className="bg-gray-100 rounded-lg shadow-md">
                  <Image
                    src={book.coverImage}
                    width={600}
                    height={48}
                    alt={book.title}
                    className="rounded-t w-full h-[250px] mb-3"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800 text-sm mb-1 overflow-hidden">
                      {book.title.length >= 25
                        ? `${book.title.slice(0, 25)}...`
                        : `${book.title}`}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2 overflow-hidden">{book.author}</p>
                    {book.availableFor.includes('sell') ? (
                      <div className="text-[#a8775a] text-sm font-semibold overflow-hidden mb-2">
                        ${book.price}
                      </div>
                    ) : (<p className="mt-1 text-lg pt-7 font-semibold text-[#a8775a]"></p>)}
                    <div className="flex justify-between items-center text-gray-600 text-sm">
                      <span className={`${book.approval === 'approved' ? 'bg-green-100' : book.approval === 'rejected' ? 'bg-red-100' : 'bg-orange-100'} px-2 py-1 rounded text-xs`}>
                        {book.approval}
                      </span>
                      <div className="flex gap-2 text-lg">
                        <FiEdit
                          onClick={() => {
                            setSelectedBook(book);
                            setShowEditModal(true);
                          }}
                          className="cursor-pointer hover:text-[#5659f7]"
                        />
                        <FiTrash
                          onClick={() => handleDeleteBook(book.id)}
                          className="cursor-pointer hover:text-[#d63d3d]"
                        />
                      </div>
                    </div>
                  </div>
                  {/* show edit book modal */}
                  {showEditModal && selectedBook && (
                    <EditBookModal
                      book={selectedBook}
                      onClose={() => {
                        setShowEditModal(false);
                        setSelectedBook(null);
                      }}
                      onUpdate={(updatedBook) => {
                        setBooks((prev) =>
                          prev.map((b) =>
                            b.id === updatedBook.id ? updatedBook : b
                          )
                        );
                        setShowEditModal(false);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Transaction History
            </h3>
            <TransactionTabs transactions={transactions} />
          </div>
        </div>
      </div>
    <Footer />
    </>
  );
}
