
'use client';

import Image from 'next/image';
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { FaBell } from 'react-icons/fa';
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

export default function ProfilePage() {

  const router = useRouter();
  const { user, loading, setUser } = useAuth();
  const [openEdit, setOpenEdit] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [books, setBooks] = useState<BookType[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;
    try {
      await logoutUser();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error(error);
      toast.error('Failed to logout');
    }
  };
  
  // fetch books
  useEffect(() => {
    if (!user?.uid) return;

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
  }, [user?.uid]);
  
  // handle delete book
  const handleDeleteBook = async (bookId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
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
    { id: 1, message: "New trade offer for 'Pride and Prejudice'", time: '2 hours ago' },
    { id: 2, message: "Message from John regarding 'The Great Gatsby'", time: '5 hours ago' },
    { id: 3, message: 'Your book listing was viewed 12 times', time: '1 day ago' },
    { id: 4, message: 'Trade completed with Emma', time: '2 days ago' }
  ];

  if (loading || !user) return null;
  
  return (
    <>
    <Header/>
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Sidebar */}
      <div className="col-span-1 space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Image width={120} height={120} src={ user.photoUrl || '/user-default.jpg'} alt="profile" className="rounded-full mx-auto mb-3" />
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
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
        {openEdit && <EditProfileModal 
          onClose={() => setOpenEdit(false)}   
          onUpdate={(updatedUser) => {
            setUser(updatedUser);
            setOpenEdit(false);
          }} />
        }

        {/* Favorite Genres */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-800 mb-4">Favorite Genres</h3>
          <div className="flex flex-wrap gap-2">
            {user.genres.map((genre, i) => (
              <span key={i} className="bg-[#a8775a]/20 text-[#a8775a] px-3 py-1 rounded-full text-sm">{genre}</span>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Recent Notifications</h3>
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
            <h3 className="text-lg font-semibold text-gray-800">Your Books for Sale/Exchange</h3>
            <button 
              className="bg-[#a8775a] text-white px-4 py-2 rounded-full hover:bg-[#946a52]" 
              onClick={() => setShowAddBook(true)}
            >+ Add New Book
            </button>
          </div>
          {/* add book popup */}
          {showAddBook && <AddBookModal 
            onClose={() => setShowAddBook(false)} 
            onAdd={ (addedBook) => {
              setBooks((prevBooks) => [...prevBooks, addedBook]);
              setShowAddBook(false);
            }} />
          }
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md">
                <Image src={book.coverImage} width={600} height={48} alt={book.title} className="rounded-t w-full h-[250px] mb-3" />
                <div className='p-4'>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">{ book.title.length >= 25 ? `${book.title.slice(0,25)}...` : `${book.title}` }</h4>
                  <p className="text-xs text-gray-500 mb-2">{book.author}</p>
                  <div className="text-[#a8775a] text-sm font-semibold mb-2">${book.price}</div>
                  <div className="flex justify-between items-center text-gray-600 text-sm">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">{book.status}</span>
                    <div className="flex gap-2 text-lg">
                      <FiEdit onClick={() => {setSelectedBook(book); setShowEditModal(true)}} className="cursor-pointer hover:text-[#5659f7]" />
                      <FiTrash onClick={() => handleDeleteBook(book.id)} className="cursor-pointer hover:text-[#d63d3d]" />
                    </div>
                  </div>
                </div>
                {/* show edit book modal */}
                { showEditModal && selectedBook  && <EditBookModal
                    book={selectedBook}
                    onClose={() => {
                      setShowEditModal(false);
                      setSelectedBook(null);
                    }}
                    onUpdate={(updatedBook) => {
                      setBooks((prev) =>
                        prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
                      );
                      setShowEditModal(false);
                    }}
                  />
                }
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Transaction History</h3>
          <div className="flex gap-4 mb-4 text-sm">
            <button className="px-3 py-1 bg-[#a8775a] text-white rounded">All</button>
            <button className="px-3 py-1 border rounded text-gray-700">Sales</button>
            <button className="px-3 py-1 border rounded text-gray-700">Purchases</button>
            <button className="px-3 py-1 border rounded text-gray-700">Trades</button>
          </div>
          <ul className="space-y-4">
            <li className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="text-sm font-medium">The Great Gatsby</p>
                <span className="text-xs text-gray-500">Sold — Jan 15, 2024</span>
              </div>
              <span className="text-sm font-semibold text-[#a8775a]">$15.00</span>
            </li>
            <li className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="text-sm font-medium">To Kill a Mockingbird</p>
                <span className="text-xs text-gray-500">Traded — Jan 12, 2024</span>
              </div>
              <span className="text-sm text-[#a8775a]">Traded for 1984</span>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Pride and Prejudice</p>
                <span className="text-xs text-gray-500">Bought — Jan 10, 2024</span>
              </div>
              <span className="text-sm font-semibold text-[#a8775a]">$20.00</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
