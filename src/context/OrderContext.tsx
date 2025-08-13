
// context/OrdersContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { OrderType } from "@/types/TransactionType";
import { useAuth } from "@/context/AuthContext";
import { BookType } from "@/types/BookType";

interface OrdersContextType {
  orders: OrderType[];
  myBooks: BookType[];
  orderLoading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [myBooks, setMyBooks] = useState<BookType[]>([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;

    const unsub = onSnapshot(collection(db, "orders"), async (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        orderId: doc.id,
        ...doc.data(),
      })) as OrderType[];

      const userOrders: OrderType[] = [];
      const booksSet = new Map<string, BookType>();

      for (const order of ordersData) {
        let orderInvolvesUser = false;

        if (order.userId === user.uid) {
          orderInvolvesUser = true;
        }

        for (const item of order.items) {
          const bookRef = doc(db, "books", item.bookId);
          const bookSnap = await getDoc(bookRef);

          if (bookSnap.exists()) {
            const bookData = bookSnap.data() as BookType;
            bookData.id = bookSnap.id;
            if (bookData.ownerId === user.uid) {
              orderInvolvesUser = true;
              booksSet.set(bookData.id, bookData);
            }
          }
        }

        if (orderInvolvesUser) {
          userOrders.push(order);
        }
      }

      setOrders(userOrders);
      setMyBooks(Array.from(booksSet.values()));
      setOrderLoading(false);
    });

    return () => unsub();
  }, [user?.uid]);

  return (
    <OrdersContext.Provider value={{ orders, myBooks, orderLoading }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
