import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BookType } from "@/types/BookType";
import { UserType } from "@/types/UserType";

export const getBookOwner = async (
  bookId: string
): Promise<UserType | null> => {
  try {
    // First, get the book document to find the ownerId
    const bookRef = doc(db, "books", bookId);
    const bookDoc = await getDoc(bookRef);

    if (!bookDoc.exists()) {
      console.error("Book not found");
      return null;
    }

    const book = bookDoc.data() as BookType;

    // Then, get the user document using the ownerId
    const userRef = doc(db, "users", book.ownerId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.error("Book owner not found");
      return null;
    }

    // Return the user data with the uid
    return {
      ...(userDoc.data() as UserType),
      uid: userDoc.id,
    };
  } catch (error) {
    console.error("Error getting book owner:", error);
    return null;
  }
};
