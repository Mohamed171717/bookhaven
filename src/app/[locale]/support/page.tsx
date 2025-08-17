
"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import Header from "@/components/layout/Header";
import { SmallFooter } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface Message {
  id?: string;
  text: string;
  sender: "user" | "bot";
  createdAt?: Date;
}

export default function ChatPage() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingBot, setLoadingBot] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingIndexRef = useRef(0);
  const { user } = useAuth();
  const t = useTranslations('ChatPage')

  // display messages
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "chatMessages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Message, "id">),
        }))
      );
    });
    return () => unsub();
  }, [user]);

  // typing bot
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === "bot") {
      setTypingText("");
      typingIndexRef.current = 0;

      const interval = setInterval(() => {
        typingIndexRef.current += 1;
        setTypingText(lastMsg.text.slice(0, typingIndexRef.current));

        if (typingIndexRef.current >= lastMsg.text.length) {
          clearInterval(interval);
          setLoadingBot(false);
        }
      }, 40);

      return () => clearInterval(interval);
    }
  }, [messages]);

  // welcome message
  const welcomeFullText = t('welcome');
  useEffect(() => {
    if (welcomeIndex < welcomeFullText.length) {
      const timeout = setTimeout(() => {
        setWelcomeIndex((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    }
  }, [welcomeIndex, welcomeFullText]);


  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!user) return toast.error("You must be logged in");

    await addDoc(collection(db, "users", user.uid, "chatMessages"), {
      text: message,
      sender: "user",
      createdAt: serverTimestamp(),
    });

    const userInput = message;
    setMessage("");
    setLoadingBot(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await res.json();
    const botReply = data.reply;
    console.log(`----------------- ${botReply}`);
    
    await addDoc(collection(db, "users", user.uid, "chatMessages"), {
      text: botReply,
      sender: "bot",
      createdAt: serverTimestamp(),
    });
    setLoadingBot(false);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  return (
    <>
    <Header/>
    <div className="pt-[120px] chat-height lg:pt-[140px] pb-10 container mx-auto px-4 md:px-8 lg:px-20">
      <div className="flex flex-col h-[68vh] messages-container max-w-3xl lg:max-w-5xl mx-auto bg-color-bg rounded-lg overflow-hidden">
        <h1 className="text-2xl font-bold mb-2 text-start">{t('mrBook')}</h1>
        <div className={`${ messages.length > 0 || "flex items-center justify-center"} flex-1 overflow-y-auto py-6 px-6 md:px-20 lg:px-40 space-y-4`}>
          {messages.length > 0 ? messages.map((msg) => (
            <div
              key={msg.id}
              className={`py-2 px-5 rounded-3xl  ${
                msg.sender === "user"
                  ? "bg-btn-color max-w-fit text-white ml-auto"
                  : "bg-gray-200 max-w-[70%] text-gray-800 mr-auto"
              }`}
            >
              {msg.sender === "bot" && msg.id === messages[messages.length - 1]?.id && typingText ? typingText : msg.text}
            </div>
          )) : (
            <div className="py-2 px-5 rounded-3xl">
              <h2 className="text-3xl font-semibold text-center">
                {welcomeFullText.slice(0, welcomeIndex)}
                {/* <span className="animate-pulse">|</span> */}
              </h2>
            </div>
          )}
          <div ref={messagesEndRef} />
        {/* loading bot typing */}
        {loadingBot && (
          <div className="text-gray-800 max-w-[70%] py-2 px-5 rounded-3xl mr-auto flex items-center space-x-2">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
          </div>
        )}
        </div>
      </div>

      <form
        onSubmit={sendMessage}
        className="flex border max-w-2xl lg:max-w-2xl mt-4 mx-auto bg-color-bg shadow-lg rounded-full overflow-hidden"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('message')}
          className="flex-grow px-4 py-2 m-3 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-btn-color text-white m-3 px-4 py-2 rounded-full hover:bg-[#4a4947] transition"
        >
          {t('send')}
        </button>
      </form>
    </div>
    {/* <Footer/> */}
    <SmallFooter />
    </>
  );
}
