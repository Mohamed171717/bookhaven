

export interface Transaction {
  transactionId: string;
  buyerId: string; // the one requesting the swap (swapper)
  sellerId: string; // book owner
  bookId: string; // book to receive
  swapWithBookId?: string; // book user is offering in exchange
  chatId: string; // chat ID for this transaction,
  type: 'sell' | 'swap';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  requesterConfirmed: false,
  responderConfirmed: false,
  createdAt: Date;
  updatedAt: Date;
};

// export interface SwapRequest {
//   id: "swapReqId123",
//   requesterId: "userA",
//   responderId: "userB",
//   requesterBookId: "bookA",
//   responderBookId: "bookB",
//   chatId: "chatId123",
//   status: "pending" | "agreed" | "completed" | "cancelled",
//   requesterConfirmed: true,
//   responderConfirmed: false,
//   createdAt: Date,
//   agreedAt: Date
// }