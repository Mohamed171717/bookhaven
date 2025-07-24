import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

interface props {
  currentUserId: string;
  otherUserId: string | undefined;
  setChatId: (id: string) => void;
  setIsChatOpen: (flag: boolean) => void;
  onSelectChat?: (id: string) => void;
}

const handleStartChat = async ({
  currentUserId,
  otherUserId,
  setChatId,
  setIsChatOpen,
}: props) => {
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

export default handleStartChat;
