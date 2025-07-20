
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BookType } from '@/types/BookType';

interface BooksContextProps {
  books: BookType[];
  loading: boolean;
  setBooks: (books: BookType[]) => void;
}

const BooksContext = createContext<BooksContextProps | undefined>(undefined);

export const BooksProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<BookType[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'books'));
        const allBooks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as BookType[];

        setBooks(allBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <BooksContext.Provider value={{ books, loading, setBooks }}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};
