"use client";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserType } from "@/types/UserType";
import Image from "next/image";

interface ChatBoxProps {
  chatId: string;
  currentUserId: string | undefined;
  otherUserId: string | undefined;
  onClose: () => void;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Timestamp;
  type: string;
}

export function ChatBox({
  chatId,
  currentUserId,
  otherUserId,
  onClose,
}: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [otherUser, setOtherUser] = useState<UserType>();

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const fetchOtherUser = async () => {
      try {
        otherUserId = otherUserId || "";
        const userRef = doc(db, "users", otherUserId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setOtherUser(userSnap.data() as UserType);
        } else {
          console.warn("User not found");
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };
    fetchOtherUser();

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...(doc.data() as Omit<Message, "id">) });
      });
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [chatId, otherUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: currentUserId,
      content: newMessage,
      read: false,
      timestamp: serverTimestamp(),
      type: "text",
    });

    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: newMessage,
      lastSenderId: currentUserId,
      lastTimestamp: serverTimestamp(),
    });

    setNewMessage("");
    scrollToBottom();
  };

  return (
    <div className="fixed bottom-4 right-4 w-[90vw] sm:w-[320px] bg-[#FAF7F0] border border-[#D8D2C2] rounded-xl shadow-lg flex flex-col z-50 max-h-[80vh]">
      <div className="bg-[#B17457] text-white px-4 py-2 flex justify-between items-center rounded-t-xl">
        <div className="flex items-center gap-2">
          {otherUser && (
            <Image
              src={otherUser.photoUrl}
              alt="Avatar"
              width={100}
              height={100}
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="font-medium">{otherUser?.name}</span>
        </div>
        <button onClick={onClose} className="text-white text-sm">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 max-h-72">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 max-w-[80%] w-fit rounded-lg text-sm ${
              msg.senderId === currentUserId
                ? "bg-[#B17457] text-white self-end ml-auto"
                : "bg-[#D8D2C2] text-[#4A4947] self-start mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t border-[#D8D2C2] flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-[#D8D2C2] px-3 py-1 text-sm text-[#4A4947]"
        />
        <button
          onClick={handleSend}
          className="bg-[#B17457] text-white px-4 py-1 rounded-lg text-sm hover:bg-[#4A4947]"
        >
          Send
        </button>
      </div>
    </div>
  );
}
