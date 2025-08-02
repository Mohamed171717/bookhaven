
import { db } from './firebase';
import { doc, getDoc, updateDoc, addDoc, Timestamp, collection } from 'firebase/firestore';

export interface Review {
  reviewId: string;
  reviewerId: string | undefined;
  targetId: string;
  rating: number;
  comment?: string;
  createdAt: Timestamp;
}

export const submitReview = async (targetId: string, reviewData: Omit<Review, 'reviewId'>, type: 'book' | 'user') => {
  const reviewRef = collection(db, 'reviews');

  // 1. Add the review
  await addDoc(reviewRef, reviewData);

  // 2. Decide which collection to update
  const targetRef = doc(db, type === 'book' ? 'books' : 'users', targetId);
  const targetSnap = await getDoc(targetRef);
  const targetData = targetSnap.data();

  const prevTotalRatings = targetData?.totalRatings || 0;
  const prevAverage = targetData?.averageRating || 0;

  // 3. Calculate new average
  const newTotalRatings = prevTotalRatings + 1;
  const newAverage =
    (prevAverage * prevTotalRatings + reviewData.rating) / newTotalRatings;

  // 4. Update book or user doc
  await updateDoc(targetRef, {
    averageRating: newAverage,
    totalRatings: newTotalRatings,
  });
};
