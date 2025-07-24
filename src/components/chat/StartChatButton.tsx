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

interface StartChatButtonProps {
  currentUserId: string;
  otherUserId: string;
}

export default function StartChatButton({
  currentUserId,
  otherUserId,
}: StartChatButtonProps) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleStartChat = async () => {
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
        className="bg-[#B17457] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#4A4947]"
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
