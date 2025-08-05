"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Star } from "lucide-react";
import clsx from "clsx";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { Review, submitReview } from "@/lib/reviews";
import { UserType } from "@/types/UserType";
import Image from "next/image";
import { FaRegStar, FaStar } from "react-icons/fa";
import StartChatButton from "./chat/StartChatButton";

interface ReviewSectionProps {
  targetId: string; // Book or user ID being reviewed
  currentUserId: string | undefined; // Reviewer ID (current logged in user)
  type: "book" | "user";
  targetUser?: UserType; // Optional label
}

export default function ReviewSection({
  targetId,
  currentUserId,
  type,
  targetUser,
}: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Fetch reviews for this target
  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(
        collection(db, "reviews"),
        where("targetId", "==", targetId)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(
        (doc) => ({ ...doc.data(), reviewId: doc.id } as Review)
      );
      setReviews(data);
      setHasReviewed(data.some((r) => r.reviewerId === currentUserId));
    };
    fetchReviews();
  }, [targetId, currentUserId]);

  const handleSubmit = async () => {
    if (!currentUserId) return toast.error("Please login to submit a review.");
    if (rating === 0 || hasReviewed) return;
    const reviewId = uuid();

    const reviewData = {
      reviewId,
      reviewerId: currentUserId,
      targetId,
      rating,
      comment,
      createdAt: Timestamp.now(),
    };

    await submitReview(targetId, reviewData, type);
    toast.success("Review submitted!");

    setRating(0);
    setComment("");
    setHasReviewed(true);

    // Refresh review list
    const q = query(
      collection(db, "reviews"),
      where("targetId", "==", targetId)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(
      (doc) => ({ ...doc.data(), reviewId: doc.id } as Review)
    );
    setReviews(data);
  };

  const avgRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return (
    <div
      className={`bg-gray-100 ${
        type === "book" ? "flex-1" : "flex-2"
      } p-4 mt-6 rounded-2xl shadow space-y-4`}
    >
      {type === "user" && targetUser && (
        <div className="space-y-6">
          {/* User Info */}
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <Image
                src={targetUser.photoUrl}
                alt="User"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">{targetUser.name}</p>
                <p className="font-medium text-sm text-gray-500">
                  {targetUser.bio}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <p className="font-semibold text-lg">
                {targetUser.averageRating.toFixed(1)}
              </p>
              <div className="flex items-center text-yellow-500 mb-1 gap-0.5 text-base">
                {Array.from({ length: 5 }, (_, i) =>
                  i < Math.round(targetUser.averageRating) ? (
                    <FaStar key={i} />
                  ) : (
                    <FaRegStar key={i} />
                  )
                )}
              </div>
            </div>
          </div>

          {hasReviewed ? (
            <p className="text-green-600 font-medium mr-48">
              You’ve reviewed this user.
            </p>
          ) : (
            <div className="flex justify-between items-center gap-3">
              <div className="flex gap-1 mr-32">
                <p className="font-medium mr-1">Rate the Owner:</p>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={clsx(
                      "w-5 h-5 cursor-pointer transition",
                      i <= (hoveredStar || rating)
                        ? "fill-yellow-400 text-yellow-500"
                        : "text-gray-500"
                    )}
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHoveredStar(i)}
                    onMouseLeave={() => setHoveredStar(0)}
                  />
                ))}
              </div>
              <div>
                <button
                  onClick={handleSubmit}
                  className="bg-btn-color text-[15px] hover:bg-[#a16950] text-gray-50 py-2 px-4 mr-1 rounded-full transition duration-300"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
          <StartChatButton
            currentUserId={currentUserId}
            otherUserId={targetId}
          />
        </div>
      )}

      {type === "book" && (
        <div className="space-y-4">
          {/* Book Review Title */}
          <h3 className="text-xl font-semibold">
            Book Reviews ({reviews.length})
          </h3>

          <p className="text-yellow-600 font-medium">
            Rate: {avgRating.toFixed(1)} / 5.0
          </p>

          {/* Review Form */}
          {!hasReviewed && (
            <div className="space-y-2">
              <p className="font-medium">Leave a review:</p>

              {/* Star Rating UI */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={clsx(
                      "w-6 h-6 cursor-pointer transition",
                      i <= (hoveredStar || rating)
                        ? "fill-yellow-400 text-yellow-500"
                        : "text-gray-500"
                    )}
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHoveredStar(i)}
                    onMouseLeave={() => setHoveredStar(0)}
                  />
                ))}
              </div>

              {/* Optional Comment */}
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment (optional)..."
                className="w-full p-2 border rounded-md"
              />

              <button
                onClick={handleSubmit}
                className="bg-btn-color text-[15px] hover:bg-[#a16950] text-gray-50 py-2 px-4 rounded-full transition duration-300"
              >
                Submit Review
              </button>
            </div>
          )}

          {hasReviewed && (
            <p className="text-green-600 font-medium">
              You’ve reviewed this book.
            </p>
          )}

          {/* Review List */}
          <div className="mt-4 space-y-4">
            {reviews.map((r) => (
              <div
                key={r.reviewId}
                className="border border-gray-500 p-3 rounded-md"
              >
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={clsx(
                        "w-4 h-4",
                        i <= r.rating
                          ? "fill-yellow-400 text-yellow-500"
                          : "text-gray-500"
                      )}
                    />
                  ))}
                </div>
                {r.comment && (
                  <p className="mt-1 text-sm text-gray-700">{r.comment}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {r.createdAt.toDate().toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
