import { Timestamp } from "firebase/firestore";

export interface Notification {
  id: string;
  reciverId: string;
  title: string;
  type: "book_sold" | "book_request" | "book_approved" | "book_rejected";
  senderId?: string;
  message: string;
  timestamp: Timestamp;
}
