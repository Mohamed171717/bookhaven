"use client";

import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChatBox } from "./ChatBox";
import toast from "react-hot-toast";

interface StartChatButtonProps {
  currentUserId: string | undefined;
  otherUserId: string;
}

export default function StartChatButton({
  currentUserId,
  otherUserId,
}: StartChatButtonProps) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleStartChat = async () => {
    if (!currentUserId) return toast.error("Please login to start a chat.");
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUserId)
    );
    const snapshot = await getDocs(q);

    const existingChat = snapshot.docs.find((doc) => {
      const participants = doc.data().participants;
      return (
        participants.includes(currentUserId) &&
        participants.includes(otherUserId) &&
        participants.length === 2
      );
    });

    if (existingChat) {
      setChatId(existingChat.id);
    } else {
      const newChatRef = await addDoc(collection(db, "chats"), {
        participants: [currentUserId, otherUserId],
        createdAt: serverTimestamp(),
        lastMessage: "",
        lastSenderId: "",
        lastTimestamp: serverTimestamp(),
      });
      setChatId(newChatRef.id);
    }

    setIsChatOpen(true);
  };

  return (
    <>
      <button
        onClick={() => handleStartChat()}
        className="bg-btn-color text-[15px] hover:bg-[#a16950] text-gray-50 ml-1 py-2 px-4 rounded-full transition duration-300"
      >
        Message
      </button>

      {isChatOpen && chatId && (
        <ChatBox
          chatId={chatId}
          currentUserId={currentUserId}
          otherUserId={otherUserId}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
}
