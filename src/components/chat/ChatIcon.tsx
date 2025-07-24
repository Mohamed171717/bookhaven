"use client";
import { useEffect, useState } from "react";
import { ChatListModal } from "./ChatListModal";
import { MessageCircle } from "lucide-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Chat } from "@/types/chatsType";
import { ChatBox } from "./ChatBox";

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
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-full bg-[#B17457] text-white hover:bg-[#4A4947]"
        title="Chats"
      >
        <MessageCircle className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <ChatListModal
            chats={chats}
            currentUserId={currentUserId!}
            onSelectChat={handleSelect}
          />
        </div>
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
  );
}
