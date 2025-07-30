import { Timestamp } from "firebase/firestore";

export interface PostType {
  postId: string;
  userId: string;
  userPhotoUrl: string;
  userName: string;
  content: string;
  imageURL?: string;
  comments?: CommentType[];
  likes?: string[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface CommentType {
  id: string;
  userId: string;
  content: string;
  createdAt: Timestamp;
  userName: string;
  userPhotoUrl: string;
}
