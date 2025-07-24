
'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp, } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Star } from 'lucide-react';
import clsx from 'clsx';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';
import { Review, submitReview } from '@/lib/reviews';

interface ReviewSectionProps {
  targetId: string;            // Book or user ID being reviewed
  currentUserId: string;       // Reviewer ID (current logged in user)
  type: 'book' | 'user';       // Optional label
}

export default function ReviewSection({ targetId, currentUserId, type }: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  
  // Fetch reviews for this target
  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(collection(db, 'reviews'), where('targetId', '==', targetId));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ ...doc.data(), reviewId: doc.id } as Review));
      setReviews(data);
      setHasReviewed(data.some(r => r.reviewerId === currentUserId));
    };
    fetchReviews();
  }, [targetId, currentUserId]);
  
  const handleSubmit = async () => {
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
    setComment('');
    setHasReviewed(true);

    // Refresh review list
    const q = query(collection(db, 'reviews'), where('targetId', '==', targetId));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ ...doc.data(), reviewId: doc.id } as Review));
    setReviews(data);
  };

  const avgRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
    <div className="bg-white flex-1 p-4 mt-6 rounded-2xl shadow space-y-4">
      <h3 className="text-xl font-semibold">
        {type === 'book' ? 'Book' : 'User'} Reviews ({reviews.length})
      </h3>

      <p className="text-yellow-600 font-medium">Average Rating: {avgRating.toFixed(1)} / 5</p>

      {!hasReviewed && (
        <div className="space-y-2">
          <p className="font-medium">Leave a review:</p>
          {/* Star Rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={clsx('w-6 h-6 cursor-pointer transition',
                  i <= (hoveredStar || rating) ? 'fill-yellow-400 text-yellow-500' : 'text-gray-400'
                )}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHoveredStar(i)}
                onMouseLeave={() => setHoveredStar(0)}
              />
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment (optional)..."
            className="w-full p-2 border rounded-md"
            rows={3}
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      )}

      {hasReviewed && (
        <p className="text-green-600 font-medium">You’ve reviewed this {type}.</p>
      )}

      {/* List of Reviews */}
      <div className="mt-4 space-y-4">
        {reviews.map((r) => (
          <div key={r.reviewId} className="border p-3 rounded-md">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={clsx('w-4 h-4',
                    i <= r.rating ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'
                  )}
                />
              ))}
            </div>
            {r.comment && <p className="mt-1 text-sm text-gray-700">{r.comment}</p>}
            <p className="text-xs text-gray-400 mt-1">{r.createdAt.toDate().toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
