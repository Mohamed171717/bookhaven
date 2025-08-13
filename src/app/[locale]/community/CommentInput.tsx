"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function CommentInput({ postId }: { postId: string }) {
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const t = useTranslations('CommunityPage')

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to comment.");
      return;
    }

    if (!content.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    const newComment = {
      userId: user.uid,
      userName: user.name || "Anonymous",
      userPhotoUrl: user.photoUrl || "/user.png",
      content: content.trim(),
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "posts", postId, "comments"), newComment);
      setContent("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      toast.error("Failed to post comment.");
    }
  };

  return (
    <div className="flex items-start gap-2">
      <div className="w-full border border-[#D8D2C2] rounded-full bg-white p-2 flex gap-2">
        <textarea
          className="resize-none flex-1 p-2 text-sm focus:outline-none bg-white text-[#4A4947]"
          rows={1}
          placeholder= {t('writeComment')}
          value={content}
          maxLength={300}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-[#B17457] text-white px-4 py-1.5 rounded-full hover:brightness-110 text-sm"
        >
          {t('post')}
        </button>
      </div>
    </div>
  );
}
