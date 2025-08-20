
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  limit,
} from "firebase/firestore";
import { BookType } from "@/types/BookType";



// Helper: fetch books
async function fetchRelevantBooks() {
  try {
    // For now, just fetch 5 books. Later you can improve with search by title/author

    const q = query(collection(db, "books"), limit(18));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No books found in database");
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<BookType, "id">),
    }));
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is missing" },
        { status: 500 }
      );
    }

    // 1. Fetch books
    const books = await fetchRelevantBooks();

    // 2. Format books into context string
    let booksContext = "No book data available.";
    if (books.length > 0) {
      booksContext = books
        .map((book, idx) => {
          const { id, title, author, genre, description, price } = book;
          return `Book ${idx + 1} 
          (ID: ${id}):
          Title: ${title || "N/A"}
          Author: ${author || "N/A"}
          Genre: ${genre || "N/A"}
          Description: ${description || "N/A"}
          Price: ${price ? `$${price}` : "Not listed"}`;
        })
        .join("\n\n");
    }

    // 3. Send to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant for a Book Trading Website.
            You help users find and ask about available books.
            Here are some books from our database:
            ${booksContext}

            Instructions:
            - Use only this book data to answer questions.
            - From our database make variable price data EGP and do not convert it with dollar in variable price
            - If the answer is not found in this data, say politely that you don’t know.
            - Be concise, friendly, and clear.`,
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
