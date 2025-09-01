"use client";

import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { CommentType } from "@/types/PostType";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function CommentCard({
  comment,
  postId,
}: {
  comment: CommentType & { id: string };
  postId: string;
}) {
  const { user } = useAuth();
  const isOwner = user?.uid === comment.userId;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("CommunityPage");

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (confirm("Delete this comment?")) {
      try {
        await deleteDoc(doc(db, "posts", postId, "comments", comment.id));
        toast.success("Comment deleted");
      } catch (err: unknown) {
        toast.error("Failed to delete comment" + err);
      }
    }
  };

  const handleEdit = async () => {
    try {
      await updateDoc(doc(db, "posts", postId, "comments", comment.id), {
        content: editContent.trim(),
      });
      setIsEditing(false);
      toast.success("Comment updated");
    } catch {
      toast.error("Failed to update comment");
    }
  };

  return (
    <div className="flex items-start gap-3 border border-[#D8D2C2] rounded-xl p-3 mb-3 bg-white relative">
      <Link href={!isOwner ? `/user/${comment.userId}` : `/profile`}>
        <Image
          src={comment.userPhotoUrl || "/user-default.jpg"}
          alt="user"
          width={32}
          height={32}
          className="rounded-full object-cover"
          style={{ aspectRatio: "1 / 1" }}
        />
      </Link>
      <div className="flex-1">
        <div className="flex justify-between items-center my-1">
          <Link href={!isOwner ? `/user/${comment.userId}` : `/profile`}>
            <p className="text-sm font-semibold">{comment.userName}</p>
          </Link>
          <p className="text-xs text-gray-500">
            {comment.createdAt?.seconds
              ? formatDistanceToNow(
                  new Date(comment.createdAt.seconds * 1000),
                  {
                    addSuffix: true,
                  }
                )
              : "Just now"}
          </p>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              placeholder="type a comment"
              className="w-full border rounded p-2 text-sm resize-none"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
              autoFocus
            />
            <div className="flex gap-2 text-sm mt-1">
              <button
                className="bg-[#B17457] text-white px-3 py-1 rounded"
                onClick={handleEdit}
              >
                {t("save")}
              </button>
              <button
                className="text-gray-500"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm mt-1 whitespace-pre-wrap overflow-hidden break-all break-words">
            {comment.content}
          </p>
        )}
      </div>

      {isOwner && !isEditing && (
        <div className="absolute top-0 right-3" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-[#4A4947] hover:text-gray-800"
            title="Post actions"
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
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 shadow-lg rounded z-50">
              <button
                className="flex items-end gap-1 w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
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
                </svg>{" "}
                {t("editComment")}
              </button>
              <button
                className="flex items-end gap-1 w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100"
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
                </svg>{" "}
                {t("deleteComment")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
