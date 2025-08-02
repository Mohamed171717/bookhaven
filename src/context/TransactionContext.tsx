
// context/TransactionContext.tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { Transaction } from '@/types/TransactionType';

export interface ExtendedTransaction extends Transaction {
  bookTitle?: string;
  bookAuthor?: string;
  bookImage?: string;
  bookPrice?: number;
  swapWithBookTitle?: string;
}

interface TransactionContextType {
  transactions: ExtendedTransaction[];
  loading: boolean;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | null>(null);

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<ExtendedTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactions = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const buyerQ = query(
        collection(db, 'transactions'),
        where('buyerId', '==', user.uid)
      );
      const sellerQ = query(
        collection(db, 'transactions'),
        where('sellerId', '==', user.uid)
      );

      const [buyerSnap, sellerSnap] = await Promise.all([
        getDocs(buyerQ),
        getDocs(sellerQ),
      ]);

      const txs = [...buyerSnap.docs, ...sellerSnap.docs];

      const extendedTxs = await Promise.all(
        txs.map(async (txDoc) => {
          const tx = txDoc.data() as Transaction;
          const transactionId = txDoc.id;

          let bookTitle = '';
          let bookAuthor = '';
          let bookImage = '';
          let bookPrice = 0;
          let swapWithBookTitle = '';

          const bookSnap = await getDoc(doc(db, 'books', tx.bookId));
          if (bookSnap.exists()) {
            const bookData = bookSnap.data();
            bookTitle = bookData.title;
            bookPrice = bookData.price;
            bookAuthor = bookData.author;
            bookImage = bookData.coverImage;
          }

          if (tx.swapWithBookId) {
            const swapSnap = await getDoc(doc(db, 'books', tx.swapWithBookId));
            if (swapSnap.exists()) {
              swapWithBookTitle = swapSnap.data().title;
            }
          }

          return {
            ...tx,
            transactionId,
            bookTitle,
            bookAuthor,
            bookImage,
            bookPrice,
            swapWithBookTitle,
          } as ExtendedTransaction;
        })
      );

      setTransactions(extendedTxs);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user?.uid]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        refreshTransactions: fetchTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
