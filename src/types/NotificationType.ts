export interface Notification {
  id: string;
  reciverId: string;
  title: string;
  type: "book_selled" | "book_request" | "book_approved" | "book_rejected";
  senderId?: string;
  message: string;
  timestamp: Date;
}
