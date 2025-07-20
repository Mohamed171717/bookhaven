

export interface UserType {
  uid: string;
  name: string;
  email: string;
  bio: string;
  role: 'reader' | 'library';
  photoUrl: string;
  genres: string[];
  verified: boolean;
  isBanned: boolean;
  profileIncomplete: boolean;
  address?: string;
  website?: string;
  bookIds: string[];
  transactionIds: string[];
  chatIds: string[];
  blogPostIds: string[];
  notificationIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
