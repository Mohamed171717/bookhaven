"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CommentCard from "./CommentCard";
import CommentInput from "./CommentInput";
import { CommentType } from "@/types/PostType";

type CommentSectionProps = {
  postId: string;
};

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentList = snapshot.docs.map((doc) => ({
        ...(doc.data() as CommentType),
        id: doc.id,
      }));
      setComments(commentList);
    });

    return () => unsubscribe();
  }, [postId]);

  return (
    <div className="space-y-4 max-h-[540px] overflow-hidden">
      <div className="max-h-[380px] overflow-auto">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} postId={postId} />
        ))}
      </div>
      <CommentInput postId={postId} />
    </div>
  );
}
