"use client";
import { useEffect, useState } from "react";
import { ChatListModal } from "./ChatListModal";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Chat } from "@/types/chatsType";
import { ChatBox } from "./ChatBox";
import { IoChatboxEllipses } from "react-icons/io5";

export function ChatIcon() {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const { user } = useAuth();
  const currentUserId = user?.uid;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatId, setChatId] = useState("");
  const [otherUserId, setOtherUserId] = useState("");
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUserId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userChats: Chat[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Chat),
        chatId: doc.id,
      }));
      setChats(userChats);

      const hasNew = userChats.some(
        (chat) => chat.lastSenderId && chat.lastSenderId !== currentUserId
      );
      setHasUnread(hasNew);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const handleSelect = (chatId: string, otherUserId: string | undefined) => {
    setOpen(false);
    setIsChatOpen(true);
    setChatId(chatId);
    setOtherUserId(otherUserId || "");
  };

  return (
    <>
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-xl md:text-[27px] mt-2 mx-2 color-primary hover:text-[#49423a] cursor-pointer"
        title="Chats"
      >
        <IoChatboxEllipses />
        {hasUnread && (
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
        )}
      </button>
      {open && (
          <ChatListModal
            onClose={() => setOpen(false)}
            chats={chats}
            currentUserId={currentUserId!}
            onSelectChat={handleSelect}
          />
      )}

      {isChatOpen && chatId && (
        <ChatBox
          chatId={chatId}
          currentUserId={currentUserId}
          otherUserId={otherUserId}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
    </>
  );
}
