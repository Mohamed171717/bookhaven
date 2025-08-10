export interface Notification {
  id: string;
  reciverId: string;
  title: string;
  type: "book_selled" | "book_request" | "book_approved";
  senderId?: string;
  message: string;
  timestamp: Date;
}

// read: boolean;
