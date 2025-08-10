"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  collection,
  arrayUnion,
  arrayRemove,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";
import { PostType } from "@/types/PostType";
import PostEdit from "./PostEdit";

interface props {
  post: PostType;
  showComment: boolean;
  onPostDeleted?: (postId: string) => void;
}

export default function PostCard({ post, showComment, onPostDeleted }: props) {
  const { user } = useAuth();
  const [livePost, setLivePost] = useState<PostType>(post);
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [uploader, setUploader] = useState<{
    name: string;
    photoUrl: string;
  } | null>(null);

  const isOwner = user?.uid === livePost.userId;

  // 🔄 Real-time sync for post
  useEffect(() => {
    const postRef = doc(db, "posts", post.postId);
    const unsub = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        setLivePost({ ...(docSnap.data() as PostType), postId: docSnap.id });
      }
    });

    return () => unsub();
  }, [post.postId]);

  useEffect(() => {
    const fetchUploader = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", post.userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUploader({
            name: data.name || "Unknown User",
            photoUrl: data.photoUrl || "/user-default.jpg",
          });
        }
      } catch (error) {
        console.error("Error fetching uploader:", error);
      }
    };

    if (post.userId) {
      fetchUploader();
    }
  }, [post.userId]);

  // 👍 Like status
  useEffect(() => {
    setLiked(user?.uid && livePost.likes?.includes(user.uid) ? true : false);
  }, [livePost.likes, user?.uid]);

  // 🔢 Comment count (static fetch)
  useEffect(() => {
    const getCommentCount = async () => {
      const snapshot = await getDocs(
        collection(db, "posts", post.postId, "comments")
      );
      setCommentCount(snapshot.size);
    };

    getCommentCount();
  }, [post.postId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle like
  const toggleLike = async () => {
    if (!user) return toast.error("You must be logged in.");
    const ref = doc(db, "posts", post.postId);

    await updateDoc(ref, {
      likes: liked ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
  };

  //delete==========
  useEffect(() => {
    const postRef = doc(db, "posts", post.postId);
    const unsub = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        setLivePost({ ...(docSnap.data() as PostType), postId: docSnap.id });
      } else {
        // Post deleted
        onPostDeleted?.(post.postId);
      }
    });

    return () => unsub();
  }, [post.postId, onPostDeleted]);

  // Delete Function
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    await deleteDoc(doc(db, "posts", post.postId));
    toast.success("Post deleted");
    // No need to call onPostDeleted here because onSnapshot will detect deletion.
  };

  // overflowing text
  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current;
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [livePost.content]);

  return (
    <div className="animated-border-card p-1 rounded-xl mb-6">
      <div className="bg-[#f1f1f1]  rounded-xl shadow-lg p-5 border border-[#dddbd4] ">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative ">
            <Image
              src={uploader?.photoUrl || "/user-default.jpg"}
              alt="user"
              width={40}
              height={40}
              className="rounded-full object-cover border-2 border-[#B17457] "
              style={{ aspectRatio: "1 / 1" }}
            />
            {isOwner && (
              <div className="absolute -bottom-1 -right-1 bg-[#B17457] rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-3 h-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#4A4947]">{uploader?.name}</p>
            <p className="text-xs text-[#B17457]">
              {formatDistanceToNow(
                livePost.createdAt?.toDate?.() || new Date(),
                {
                  addSuffix: true,
                }
              )}
            </p>
          </div>
          {isOwner && (
            <div className="ml-auto relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-[#4A4947] hover:text-[#B17457] transition-colors"
                title="Post actions"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </button>

              {isEditing && (
                <PostEdit
                  isOpen={isEditing}
                  onClose={() => setIsEditing(false)}
                  post={post}
                />
              )}

              {showMenu && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-[#D8D2C2] rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    className="w-full px-4 py-2 text-left flex items-center gap-2 text-[#4A4947] text-sm hover:bg-[#FAF7F0] transition-colors"
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    Edit Post
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left flex items-center gap-2 text-sm text-red-600 hover:bg-[#FAF7F0] transition-colors"
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 text-[#4A4947] mb-3">
          <p
            ref={contentRef}
            className={`text-[15px] leading-relaxed break-all ${
              showComment ? "line-clamp-3" : ""
            }`}
          >
            {livePost.content}
          </p>
          {showComment && isOverflowing && (
            <Link
              className="mt-2 text-sm text-[#B17457] hover:underline"
              href={`/community/${post.postId}`}
            >
              Read More
            </Link>
          )}
        </div>

        {/* Image */}
        {livePost.imageURL && livePost.imageURL !== "" && (
          <div
            className={`rounded-md overflow-hidden mb-4 ${
              showComment && `max-h-[400px]`
            }`}
          >
            <Link href={`/community/${post.postId}`}>
              <Image
                src={livePost.imageURL}
                alt="post"
                width={600}
                height={400}
                className=" w-full object-cover border border-[#D8D2C2]"
              />
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 pt-3 border-t border-[#D8D2C2]">
          {/* Like */}
          <button
            onClick={toggleLike}
            className="flex items-center gap-2 group"
          >
            <div className="p-1.5 rounded-full group-hover:bg-[#D8D2C2]/50 transition-colors">
              {liked ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#B17457"
                  className="w-5 h-5"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#4A4947"
                  className="w-5 h-5 group-hover:stroke-[#B17457] transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-sm ${
                liked ? "text-[#B17457] font-medium" : "text-[#4A4947]"
              }`}
            >
              {livePost.likes?.length || 0}
            </span>
          </button>

          {/* Comment */}
          {showComment && (
            <Link
              href={`/community/${post.postId}`}
              className="flex items-center gap-2 group"
            >
              <div className="p-1.5 rounded-full group-hover:bg-[#D8D2C2]/50 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#4A4947"
                  className="w-5 h-5 group-hover:stroke-[#B17457] transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                  />
                </svg>
              </div>
              <span className="text-sm text-[#4A4947] group-hover:text-[#B17457] transition-colors">
                {commentCount} Comments
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
