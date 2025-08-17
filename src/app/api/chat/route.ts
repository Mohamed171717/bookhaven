
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

async function searchBooksAndPosts(term: string) {
  const searchTerm = term.toLowerCase();

  // Books
  const booksRef = collection(db, "books");
  const booksQuery = query(
    booksRef,
    orderBy("titleLower"),
    where("titleLower", ">=", searchTerm),
    where("titleLower", "<=", searchTerm + "\uf8ff"),
    limit(10)
  );
  const booksSnapshot = await getDocs(booksQuery);
  const books = booksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Posts
  const postsRef = collection(db, "posts");
  const postsQuery = query(
    postsRef,
    orderBy("contentLower"),
    where("contentLower", ">=", searchTerm),
    where("contentLower", "<=", searchTerm + "\uf8ff"),
    limit(10)
  );
  const postsSnapshot = await getDocs(postsQuery);
  const posts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return { books, posts };
}
