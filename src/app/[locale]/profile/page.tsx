"use client";

import Image from "next/image";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { FaBell, FaRegStar, FaStar } from "react-icons/fa";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import EditProfileModal from "@/components/EditProfileModal";
import { logoutUser } from "@/lib/authService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AddBookModal from "@/components/AddBookForm";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BookType } from "@/types/BookType";
import EditBookModal from "@/components/EditBookModal";
// import { useTransactionContext } from '@/context/TransactionContext';
// import TransactionTabs from '@/components/TransactionTab';
import ConfirmDialog from "@/components/ConfirmDialog";
import { useTranslations } from "next-intl";
import { useOrders } from "@/context/OrderContext";
import { Notification } from "@/types/NotificationType";
import { formatDistanceToNow } from "date-fns";
// import { Transaction } from '@/types/TransactionType';

export default function ProfilePage() {
  // const { transactions } = useTransactionContext();
  const router = useRouter();
  const { user, loading, setUser } = useAuth();
  const { orders, myBooks, orderLoading } = useOrders();
  const [openEdit, setOpenEdit] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [books, setBooks] = useState<BookType[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const t = useTranslations("ProfilePage");

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
    setBookToDelete(bookId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;

    try {
      const bookRef = doc(db, "books", bookToDelete);
      await deleteDoc(bookRef);
      toast.success("Book deleted successfully");
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== bookToDelete)
      );
      setBookToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete book");
    }
  };

  useEffect(() => {
    if (!user?.uid) return;

    const fetchNotifications = async () => {
      try {
        const q = query(
          collection(db, "notifications"),
          where("reciverId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        let userNotifications = snapshot.docs.map((doc) => ({
          ...(doc.data() as Notification),
          id: doc.id,
        }));
        // Sort by timestamp (descending)
        userNotifications = userNotifications.sort((a, b) => {
          const aTime = a.timestamp?.toDate
            ? a.timestamp.toDate().getTime()
            : 0;
          const bTime = b.timestamp?.toDate
            ? b.timestamp.toDate().getTime()
            : 0;
          return bTime - aTime;
        });
        // Take the latest 10
        setNotifications(userNotifications.slice(0, 10));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  // handle logout
  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    }
  };

  const filterOrder = orders.filter((order) => order.userId === user?.uid);

  if (loading || !user) return null;

  return (
    <>
      <Header />
      <div className="max-w-7xl px-4 md:px-6 fix-height pt-[155px] pb-10 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Sidebar */}
        <div className="col-span-1 space-y-4 md:space-y-6">
          {/* Profile Card */}
          <div className="bg-card-bg border p-6 mt-16 md:p-8 rounded-lg shadow-md text-center">
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
            <div className="flex w-[90px] m-auto my-3 items-center gap-1">
              {user.averageRating !== undefined && (
                <div className="flex items-center text-yellow-500 mb-1 gap-0.5 text-base md:text-lg">
                  {Array.from({ length: 5 }, (_, i) =>
                    i < Math.round(user.averageRating!) ? (
                      <FaStar key={i} />
                    ) : (
                      <FaRegStar key={i} />
                    )
                  )}
                </div>
              )}
            </div>
            <p className="mt-3 text-sm md:text-base text-gray-600 mb-4">
              {user.bio}
            </p>
            {user.role === "library" && user.address && (
              <>
                <p className="text-sm md:text-base text-gray-600 mb-4">
                  {t("address")} {user.address}
                </p>
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="px-4 py-2 rounded-full bg-[#a8775a] text-white hover:bg-[#946a52] text-sm md:text-base font-medium"
                onClick={() => setOpenEdit(true)}
              >
                {t("editProfile")}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition text-sm md:text-base font-medium"
              >
                {t("logout")}
              </button>
            </div>
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
          {user.role === "reader" && (
            <div className="bg-card-bg border p-6 md:p-8 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-800 mb-4 md:mb-6 text-base md:text-lg">
                {t("favoriteGenres")}
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

          {/* Notifications */}
          <div className="bg-card-bg border p-6 md:p-8 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 text-base md:text-lg">
                {t("recent")}
              </h3>
              <FaBell className="text-gray-600 text-lg" />
            </div>
            <ul className="space-y-4 text-sm md:text-base text-gray-700 max-h-[220px] overflow-y-auto">
              {notifications.map((note) => (
                <li key={note.id} className="border-l-4 border-[#a8775a] pl-3">
                  <p className="mb-1">{note.message}</p>
                  <span className="text-xs md:text-sm text-gray-400">
                    {note.timestamp instanceof Date
                      ? note.timestamp.toLocaleString()
                      : typeof note.timestamp?.toDate === "function"
                      ? formatDistanceToNow(note.timestamp.toDate())
                      : String(note.timestamp)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-1 lg:col-span-2 space-y-6 md:space-y-8">
          {/* Books for Sale/Trade */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                {t("myBooks")}
              </h3>
              <button
                className="bg-[#a8775a] text-white px-4 py-2 rounded-full hover:bg-[#946a52] text-sm md:text-base font-medium"
                onClick={() => setShowAddBook(true)}
              >
                {t("add")}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-card-bg border rounded-lg shadow-md"
                >
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
                        : `${book.title}`}
                    </h4>
                    <p className="text-sm md:text-base text-gray-500 mb-3 overflow-hidden">
                      {book.author}
                    </p>
                    {book.availableFor.includes("sell") ? (
                      <div className="text-[#a8775a] text-sm md:text-base font-semibold overflow-hidden mb-3">
                        {book.price} EGP
                      </div>
                    ) : (
                      <p className="mt-1 text-lg pt-7 font-semibold text-[#a8775a]"></p>
                    )}
                    <div className="flex justify-between items-center text-gray-600 text-sm md:text-base">
                      <span
                        className={`${
                          book.approval === "approved"
                            ? "bg-green-100 border"
                            : book.approval === "rejected"
                            ? "bg-red-100 border"
                            : "bg-orange-100 border"
                        } px-3 py-1 rounded text-sm font-medium`}
                      >
                        {book.approval}
                      </span>
                      <div className="flex gap-3 text-lg md:text-xl">
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
          <div className="bg-card-bg border h-[500px] overflow-y-scroll p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-lg md:text-xl font-semibold mb-6 text-gray-800">
              {t("tran")}
            </h3>

            <h4 className="font-medium mb-5">{t("order")}</h4>
            {orderLoading ? (
              <p className="text-gray-500 text-center">{t("orderLoading")}</p>
            ) : filterOrder.length === 0 ? (
              <p className="text-center">{t("noOrder")}</p>
            ) : (
              <>
                {filterOrder.map((order) => (
                  <div
                    key={order.orderId}
                    className="border my-4 bg-white rounded-lg p-4 shadow-sm"
                  >
                    {order.items.map((item) => (
                      <div
                        key={item.bookId}
                        className="flex space-y-6 gap-5 items-center"
                      >
                        <div className="w-14 h-20 relative rounded-md overflow-hidden">
                          <Image
                            width={600}
                            height={600}
                            src={item.coverImage}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-gray-800">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-500">{item.author}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                order.status === "delivered"
                                  ? "bg-green-200 text-green-700"
                                  : order.status === "pending"
                                  ? "bg-yellow-200 text-yellow-700"
                                  : "bg-red-200 text-red-700"
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="text-xs text-gray-400">
                              {order.createdAt instanceof Date
                                ? order.createdAt.toLocaleDateString()
                                : order.createdAt.toDate().toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="text-[#B76E58] flex-auto text-end font-semibold">
                          {item.price?.toFixed(2)} EGP
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}

            <h4 className="font-medium my-5">{t("sold")}</h4>
            {orderLoading ? (
              <p className="text-gray-500 text-center">{t("orderLoading")}</p>
            ) : myBooks.length === 0 ? (
              <p className="text-gray-500 text-center">{t("noOrders")}</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  // Filter the items in this order to only those belonging to the logged-in user
                  const matchingItems = order.items.filter((item) =>
                    myBooks.some((book) => book.id === item.bookId)
                  );

                  return (
                    <div
                      key={order.orderId}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      {matchingItems.map((item) => {
                        const book = myBooks.find((b) => b.id === item.bookId);
                        if (!book) return null;

                        return (
                          <div
                            key={book.id}
                            className="flex items-center justify-between py-2 border-b last:border-b-0"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-14 h-20 relative rounded-md overflow-hidden">
                                <Image
                                  width={600}
                                  height={600}
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="text-base font-semibold text-gray-800">
                                  {book.title}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {book.author}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      order.status === "delivered"
                                        ? "bg-green-200 text-green-700"
                                        : order.status === "pending"
                                        ? "bg-yellow-200 text-yellow-700"
                                        : "bg-red-200 text-red-700"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {order.createdAt instanceof Date
                                      ? order.createdAt.toLocaleDateString()
                                      : order.createdAt
                                          .toDate()
                                          .toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <span className="text-[#B76E58] font-semibold">
                              {book.price?.toFixed(2)} EGP
                            </span>
                          </div>
                        );
                      })}

                      <div className="text-right mt-2 text-sm text-gray-600">
                        {t("total")}:{" "}
                        <span className="font-medium">
                          {order.payment.amount} {order.payment.currency}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      {/* Confirm Delete Book Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setBookToDelete(null);
        }}
        onConfirm={confirmDeleteBook}
        title={t("deleteBook")}
        message={t("confirmDelete")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        confirmButtonColor="bg-red-600 hover:bg-red-700"
      />

      {/* Confirm Logout Dialog */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
        title={t("logout")}
        message={t("confirm")}
        confirmText={t("logout")}
        cancelText={t("cancel")}
        confirmButtonColor="bg-red-600 hover:bg-red-700"
      />
    </>
  );
}
