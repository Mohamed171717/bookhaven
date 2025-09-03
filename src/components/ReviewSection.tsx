"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  Timestamp,
  getDoc,
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
import { useTranslations } from "next-intl";
import { CartItem } from "@/types/CartType";
// import StartChatButton from './chat/StartChatButton';

interface ReviewWithUser extends Review {
  reviewerName: string;
  reviewerPhoto: string;
}

interface ReviewSectionProps {
  targetId: string; // Book or user ID being reviewed
  currentUserId: string | undefined; // Reviewer ID (current logged in user)
  type: "book" | "user";
  targetUser: UserType | undefined;
  onRatingUpdate?: (newAverage: number, newTotal: number) => void;
}

export default function ReviewSection({
  targetId,
  currentUserId,
  type,
  targetUser,
  onRatingUpdate,
}: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const t = useTranslations("ShopPage");

  // Fetch reviews for this target
  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(
        collection(db, "reviews"),
        where("targetId", "==", targetId)
      );
      const snapshot = await getDocs(q);

      const reviewsData = await Promise.all(
        snapshot.docs.map(async (dc) => {
          const review = dc.data() as ReviewWithUser;

          // Fetch reviewer data
          let reviewerName = "Unknown User";
          let reviewerPhoto = "/default-avatar.png";

          if (review.reviewerId) {
            const userDoc = await getDoc(doc(db, "users", review.reviewerId));
            if (userDoc.exists()) {
              const userData = userDoc.data() as UserType;
              reviewerName = userData.name || reviewerName;
              reviewerPhoto = userData.photoUrl || reviewerPhoto;
            }
          }

          return {
            ...review,
            // reviewId: doc.id,
            reviewerName,
            reviewerPhoto,
          };
        })
      );

      setReviews(reviewsData);
      setHasReviewed(reviewsData.some((r) => r.reviewerId === currentUserId));
    };

    fetchReviews();
  }, [targetId, currentUserId]);

  // check if the user has purchased
  useEffect(() => {
    if (!currentUserId) return;

    const checkPurchase = async () => {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", currentUserId)
      );
      const snapshot = await getDocs(q);

      let purchased = false;

      snapshot.forEach((doc) => {
        const order = doc.data();

        if (type === "book") {
          if (order.items?.some((item: CartItem) => item.bookId === targetId)) {
            purchased = true;
          }
          // } else if (type === "user") {
          //   if (order.items?.some((item: CartItem) => item.user === targetId)) {
          //     purchased = true;
          //   }
        }
      });

      setHasPurchased(purchased);
    };

    checkPurchase();
  }, [currentUserId, targetId, type]);

  // handle review request
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

    const { newAverage, newTotalRatings } = await submitReview(
      targetId,
      reviewData,
      type
    );
    toast.success("Review submitted!");

    setRating(0);
    setComment("");
    setHasReviewed(true);

    // Get current reviewer info (instead of using targetUser)
    let reviewerName = "You";
    let reviewerPhoto = "/default-avatar.png";
    const userDoc = await getDoc(doc(db, "users", currentUserId));
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserType;
      reviewerName = userData.name || reviewerName;
      reviewerPhoto = userData.photoUrl || reviewerPhoto;
    }

    setReviews((prev) => [
      ...prev,
      {
        ...reviewData,
        reviewerName,
        reviewerPhoto,
      },
    ]);

    // Update local targetUser or book rating without refetch
    if (targetUser) {
      targetUser.averageRating = newAverage;
      targetUser.totalRatings = newTotalRatings;
    }

    if (onRatingUpdate) {
      onRatingUpdate(newAverage, newTotalRatings);
    }
  };

  // const avgRating = reviews.length
  //   ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  //   : 0;

  return (
    <div
      className={`bg-card-bg border ${
        type === "book" ? "flex-1" : "flex-2 h-fit"
      } p-4 mt-6 rounded-2xl shadow space-y-4`}
    >
      {/* review books */}
      {type === "book" && (
        <div className="space-y-4">
          {/* Review Form */}
          {hasReviewed ? (
            <p className="text-green-600 font-medium">{t("BookReview")}</p>
          ) : (
            <>
              {hasPurchased && (
                <div className="space-y-2">
                  <p className="font-medium">{t("leaveReview")}</p>
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
                    placeholder={t("writeComment")}
                    className="w-full p-2 border rounded-md"
                  />

                  <button
                    onClick={handleSubmit}
                    disabled={currentUserId === targetUser!.uid}
                    className="bg-btn-color disabled:bg-[#b17457c0] text-[15px] hover:bg-[#a16950] text-gray-50 py-2 px-4 rounded-full transition duration-300"
                  >
                    {t("submitReview")}
                  </button>
                </div>
              )}
              {!hasPurchased && (
                <p className="text-gray-500 text-sm">
                  {t("can")}
                </p>
              )}
            </>
          )}

          <h3 className="text-xl font-semibold">
            {t("allReview")} ({reviews.length})
          </h3>
          {/* Review List */}
          <div className="mt-4 space-y-4">
            {reviews.map((r) => (
              <div
                key={r.reviewId}
                className="border space-y-3 border-gray-300 p-3 rounded-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src={r.reviewerPhoto}
                    alt={r.reviewerName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <p className="font-medium">{r.reviewerName}</p>
                </div>

                <div className="flex items-center gap-1">
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

      {/* review users */}
      {type === "user" && targetUser && (
        <div className="space-y-6">
          {/* User Info */}
          <div className="flex justify-between flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-3">
              <Image
                src={targetUser.photoUrl}
                alt="User"
                width={50}
                height={50}
                className="rounded-full w-12 h-12"
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
              {t("userReview")}
            </p>
          ) : (
            // <>
            // { hasPurchased && (
            <div className="flex justify-between flex-col sm:flex-row items-center gap-3">
              <div className="flex gap-1 mr-2 sm:mr-32">
                <p className="font-medium mr-1">{t("rateOwner")}</p>
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
                  disabled={currentUserId === targetId}
                  className="bg-btn-color disabled:bg-[#b17457c0] text-[15px] hover:bg-[#a16950] text-gray-50 py-2 px-4 mr-1 rounded-full transition duration-300"
                >
                  {t("rate")}
                </button>
              </div>
            </div>
          )}
          {/* {!hasPurchased && (
            <p className="text-gray-500 text-sm">
              You can only review this user after purchasing his items.
            </p>
          )} */}
          {/* </>
        )} */}
          {/* <StartChatButton currentUserId={currentUserId} otherUserId={targetId}/> */}
        </div>
      )}
    </div>
  );
}
