"use client";

import Header from "@/components/layout/Header";
import PostCreator from "@/app/[locale]/community/PostCreator";
import PostCard from "./PostCard";
import { PostType } from "@/types/PostType";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function BlogPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        postId: doc.id,
      })) as PostType[];

      setPosts(data);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <PostCreator />
          <div className="mt-4 space-y-4">
            {loading ? (
              <p>Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-center text-[#4A4947]">No posts yet.</p>
            ) : (
              posts.map((post) => {
                if (post.content == "") return;
                return (
                  <PostCard key={post.postId} post={post} showComment={true} />
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
