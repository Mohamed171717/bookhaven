

export interface BookType {
  id: string;
  ownerId: string;
  ownerType: 'reader' | 'library';
  title: string;
  author: string;
  genre: string;
  condition: 'new' | 'used';
  description: string;
  availableFor: ('sell' | 'swap')[];
  coverImage: string;
  price?: number; 
  isbn: string;
  quantity?: number;
  averageRating?: number;
  totalRatings?: number;
  approval: 'pending' | 'approved' | 'rejected';
  isDeleted: boolean; 
  status: 'available' | 'sold' | 'swapped';
  images: string[];
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}