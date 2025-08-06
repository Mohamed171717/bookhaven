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
}

export default function PostCard({ post, showComment }: props) {
  const { user } = useAuth();
  const [livePost, setLivePost] = useState<PostType>(post);
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  //  Delete
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    await deleteDoc(doc(db, "posts", post.postId));
    toast.success("Post deleted");
  };

  return (
    <div className="bg-[#FAF7F0] overflow-hidden rounded-xl shadow p-4 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Image
          src={post.userPhotoUrl || "/user.png"}
          alt="user"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="text-sm text-[#4A4947]">
          <p className="font-medium">{post.userName}</p>
          <p className="text-xs">
            {formatDistanceToNow(livePost.createdAt?.toDate?.() || new Date(), {
              addSuffix: true,
            })}
          </p>
        </div>
        {isOwner && (
          <div className="ml-auto relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-[#4A4947] hover:text-gray-800"
              title="Post actions"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-6"
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
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md z-50">
                <button
                  className="w-full px-3 py-2 text-left flex items-end gap-1 text-[#4A4947] text-sm hover:bg-gray-100"
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
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  className="w-full px-3 py-2 text-left flex items-end gap-1 text-sm text-red-600 hover:bg-gray-100"
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
                    stroke="red"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="text-[#4A4947] mb-2">
        <p className="mt-1">{livePost.content}</p>
      </div>

      {/* Image */}
      {livePost.imageURL && (
        <div
          className={`rounded-xl  overflow-hidden mb-3 ${
            showComment && `max-h-[400px]`
          }`}
        >
          <Image
            src={livePost.imageURL}
            alt="post"
            width={600}
            height={600}
            className="rounded w-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-8 text-[#4A4947]">
        {/* Like */}
        <button onClick={toggleLike} className="flex items-center gap-1">
          {liked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="red"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="red"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          )}
          <span>{livePost.likes?.length || 0}</span>
        </button>

        {/* Comment */}
        {showComment && (
          <Link
            href={`/community/${post.postId}`}
            className="flex items-center gap-1 text-[#4A4947] font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>

            <span>{commentCount} Comments</span>
          </Link>
        )}
      </div>
    </div>
  );
}
