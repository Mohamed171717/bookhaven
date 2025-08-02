
export interface Chat {
  chatId: string;
  bookId?: string;
  transactionId?: string;
  participants: string[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  lastSenderId: string;
}

export interface Message {
  messageId: string;
  senderId: string;
  content: string;
  read: boolean;
  timestamp: Date;
  type?: "text" | "offer" | "system";
}
