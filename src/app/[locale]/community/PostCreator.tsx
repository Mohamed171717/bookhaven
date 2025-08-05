"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
//==
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImageToImageKit } from "@/app/[locale]/utils/imagekitUpload";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import toast from "react-hot-toast";
import { PostType } from "@/types/PostType";

interface PostCreatorProps {
  onPostCreated?: (post: PostType) => void;
}

const PostCreator = ({ onPostCreated }: PostCreatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [content, setContent] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Post content can't be empty.");
      return;
    }

    setLoading(true);
    const postingToast = toast.loading("Sharing your post...");

    try {
      let imageUrl: string | null = "";

      if (image) {
        imageUrl = await uploadImageToImageKit(image);
      }

      // Create post in Firestore
      const newPostRef = await addDoc(collection(db, "posts"), {
        userId: user?.uid,
        content,
        imageURL: imageUrl || "",
        createdAt: serverTimestamp(),
        userPhotoUrl: user?.photoUrl,
        userName: user?.name,
        likes: [],
      });

      // Fetch the newly created post with timestamp
      const newPostSnap = await getDoc(doc(db, "posts", newPostRef.id));

      if (newPostSnap.exists()) {
        const newPostData = newPostSnap.data();
        const newPost: PostType = {
          ...(newPostData as PostType),
          postId: newPostSnap.id,
        };

        // Trigger callback to update UI
        onPostCreated?.(newPost);
      }

      toast.success("Post shared!", { id: postingToast });

      // Reset states
      setIsOpen(false);
      setContent("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error posting:", error);
      toast.error("Something went wrong.", { id: postingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Box */}
      <div className="bg-[#f1f1f1] rounded-xl shadow-md p-4 mb-6 flex gap-3 items-center mt-20 border border-[#D8D2C2]">
        <div className="relative">
          <Image
            src={user?.photoUrl || "/user-default.jpg"}
            alt="user"
            width={48}
            height={48}
            className="rounded-full border-2 border-[#B17457]"
          />
          <div className="absolute -bottom-1 -right-1 bg-[#B17457] rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#FAF7F0"
              className="w-3 h-3"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div
          onClick={() => setIsOpen(true)}
          className="cursor-pointer text-[#4A4947] bg-white px-5 py-3 rounded-full w-full text-left hover:bg-[#FAF7F0] transition-colors duration-200 border border-[#D8D2C2] focus-within:ring-2 focus-within:ring-[#B17457] focus-within:border-transparent"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base">
              What book are you thinking about?
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#B17457"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xl rounded-xl bg-[#FAF7F0] p-6 shadow-xl relative">
            <Dialog.Title className="text-2xl font-semibold text-[#4A4947] mb-4">
              Share a post
            </Dialog.Title>

            {/* Post Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Content */}
              <div>
                <label className="block text-[#4A4947] font-medium mb-1">
                  Your Thoughts
                </label>
                <textarea
                  rows={5}
                  maxLength={800}
                  placeholder="Write your post here..."
                  className="w-full border border-[#D8D2C2] rounded-md p-2 bg-white resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <p className="text-sm text-[#4A4947] mt-1">
                  Max 800 characters
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-[#4A4947] font-medium mb-1">
                  Image
                </label>
                {imagePreview ? (
                  <div className="relative group">
                    <Image
                      width={600}
                      height={600}
                      src={imagePreview}
                      alt="Preview"
                      className="w-1/2 m-auto h-52 object-cover rounded-md mb-2"
                    />
                    <button
                      title="delete this image"
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-[#D8D2C2] hover:brightness-90 px-2 py-1 text-sm rounded  transition"
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
                    </button>
                  </div>
                ) : (
                  <label className="block w-full border-2 border-dashed border-[#D8D2C2] rounded-md p-4 text-center cursor-pointer hover:bg-[#eeeae2] transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <span className="text-[#4A4947]">
                      Click to upload image
                    </span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#B17457] text-white font-semibold py-2 px-6 rounded-full hover:bg-[#a1674d] transition disabled:opacity-50"
                >
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </form>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-4 text-[#4A4947] text-2xl"
            >
              ×
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default PostCreator;
