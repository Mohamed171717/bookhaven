"use client";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PostType } from "@/types/PostType";
import Header from "@/components/layout/Header";
import PostCard from "../PostCard";
import CommentSection from "../CommentSection";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function PostPage() {
  const { id } = useParams();
  const postId = id;  
  const t = useTranslations("CommunityPage");
  const [ post, setPost ] = useState<PostType>();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(collection(db, "posts"), where("postId", "==", postId));
        const postSnap = await getDocs(q);
        
        // if (!postSnap.empty) {
          const doc = postSnap.docs[0];
          const postData = doc.data() as PostType;
          console.log("Post ID from URL:", postData);
          setPost(postData);
        // }
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };
    if (postId) fetchPost();
  },[postId]);

  if (!post) {
    return (
      <>
      <h2 className="text-center mt-[25%]">Loading Post...</h2>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-secondary-color fix-height pt-[155px] pb-10">
        <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-6 bg-secondary-color max-w-6xl mx-auto px-6 pb-6 text-[#4A4947]">
          {/* Left side: post details */}
          {/* <PostContentLeft post={post} /> */}
          <PostCard post={post} showComment={false} />

          {/* Right side: comments */}
          <div className="bg-[#FAF7F0] border border-[#D8D2C2] rounded-2xl p-4 h-fit shadow">
            <h2 className="text-lg font-semibold mb-3">{t('all')}</h2>

            <CommentSection postId={post.postId} />
          </div>
        </div>
      </div>
    </>
  );
}
