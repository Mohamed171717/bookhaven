// app/[locale]/community/[id]/page.tsx
// "use client";
import { getDoc, doc } from "firebase/firestore";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase";
import { PostType } from "@/types/PostType";
import Header from "@/components/layout/Header";
import PostCard from "../PostCard";
import CommentSection from "../CommentSection";

interface Props {
  params: { id: string };
}

export default async function PostPage({ params }: Props) {
  const postId = params.id;

  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) return notFound();

  const post = { ...(postSnap.data() as PostType), postId };

  return (
    <>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4 py-6 text-[#4A4947]">
        {/* Left side: post details */}
        {/* <PostContentLeft post={post} /> */}
        <PostCard post={post} showComment={false} />

        {/* Right side: comments */}
        <div className="bg-[#FAF7F0] border border-[#D8D2C2] rounded-2xl p-4 h-fit shadow">
          <h2 className="text-lg font-semibold mb-3">All Comments</h2>

          <CommentSection postId={postId} />
        </div>
      </div>
    </>
  );
}
