"use client";
import { useEffect, useState } from "react";
import { Chat } from "@/types/chatsType";
import { UserType } from "@/types/UserType";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { ChatBox } from "./ChatBox";

type Props = {
  chats: Chat[];
  currentUserId: string;
  onSelectChat: (chatId: string, otherUserId: string | undefined) => void;
};

export function ChatListModal({ chats, currentUserId, onSelectChat }: Props) {
  const [otherUsers, setOtherUsers] = useState<Record<string, UserType>>({});
  const [chatId, setChatId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchOtherUsers = async () => {
      const userMap: Record<string, UserType> = {};

      for (const chat of chats) {
        const otherId = chat.participants.find((id) => id !== currentUserId);
        if (otherId && !userMap[otherId]) {
          const docRef = doc(db, "users", otherId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            userMap[otherId] = docSnap.data() as UserType;
          }
        }
      }

      setOtherUsers(userMap);
    };

    if (chats.length > 0) fetchOtherUsers();
  }, [chats, currentUserId]);

  const handleStartChat = async (
    otherUserId: string | undefined,
    chat: Chat
  ) => {
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
    }
    setIsChatOpen(true);
    onSelectChat(chat.chatId, otherUserId);
  };

  return (
    <div className="w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-2 border-b font-semibold text-[#4A4947] bg-[#FAF7F0]">
        Recent Chats
      </div>
      <ul className="max-h-80 overflow-y-auto">
        {chats.map((chat) => {
          const otherId = chat.participants.find((id) => id !== currentUserId);
          const otherUser = otherId ? otherUsers[otherId] : null;
          console.log(otherId);
          console.log(otherUser);

          return (
            <li
              key={chat.chatId}
              onClick={() => {
                handleStartChat(otherId, chat);
              }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#D8D2C2] cursor-pointer"
            >
              {otherUser?.photoUrl ? (
                <Image
                  src={otherUser.photoUrl}
                  alt={otherUser.name}
                  width={30}
                  height={30}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white">
                  {otherUser?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div>
                <div className="font-medium text-[#4A4947]">
                  {otherUser?.name || "Unknown User"}
                </div>
                {/* <div className="text-sm text-gray-500 truncate w-40">
                  {chat.messages?.[chat.messages.length - 1]?.content ||
                    "No messages yet"}
                </div> */}
              </div>
              {isChatOpen && chatId && (
                <ChatBox
                  chatId={chatId}
                  currentUserId={currentUserId}
                  otherUserId={otherId}
                  onClose={() => setIsChatOpen(false)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
