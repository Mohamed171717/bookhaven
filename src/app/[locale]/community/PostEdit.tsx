"use client";

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { uploadImageToImageKit } from "@/app/[locale]/utils/imagekitUpload";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import toast from "react-hot-toast";
import { PostType } from "@/types/PostType";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostType;
}

export default function EditPostModal({
  isOpen,
  onClose,
  post,
}: EditPostModalProps) {
  const [content, setContent] = useState(post.content || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    post.imageURL || null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setContent(post.content || "");
      setImageFile(null);
      setImagePreview(post.imageURL || null);
    }
  }, [isOpen, post]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Post content can't be empty.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating your post...");

    try {
      let imageURL = post.imageURL || null;

      if (imageFile) {
        imageURL = await uploadImageToImageKit(imageFile);
      }

      const postRef = doc(db, "posts", post.postId);
      await updateDoc(postRef, {
        content,
        imageURL: imageURL || null,
        updatedAt: new Date(),
      });

      toast.success("Post updated!", { id: toastId });
      onClose();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Something went wrong.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xl rounded-xl bg-[#FAF7F0] p-6 shadow-xl relative">
          <Dialog.Title className="text-2xl font-semibold text-[#4A4947] mb-4">
            Edit Post
          </Dialog.Title>

          <form className="space-y-4" onSubmit={handleUpdate}>
            {/* Content */}
            <div>
              <label className="block text-[#4A4947] font-medium mb-1">
                Your Thoughts
              </label>
              <textarea
                rows={5}
                maxLength={600}
                placeholder="Update your post..."
                className="w-full border border-[#D8D2C2] rounded-md p-2 bg-white resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="text-sm text-[#4A4947] mt-1">Max 600 characters</p>
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
                    title="Remove image"
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-[#D8D2C2] hover:brightness-90 px-2 py-1 text-sm rounded transition"
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
                  <span className="text-[#4A4947]">Click to upload image</span>
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
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-[#4A4947] text-2xl"
          >
            ×
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
