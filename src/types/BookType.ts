

export interface BookType {
  id: string;
  ownerId: string;
  ownerType: 'reader' | 'library';
  title: string;
  author: string;
  genre: Genre;
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
  images: (string | null)[];
  location?: Location;
  createdAt: Date;
  updatedAt: Date;
}

export type Genre = 
    "Fiction" | "Fantasy"| "Science Fiction" | "Mystery & Thriller"|
    "Romance" | "Historical" | "Young Adult" | "Horror" |
    "Biography" | "Personal Growth";

export type Location = 
    "Cairo" | "Giza" | "Alexandria" | "Dakahlia" | "Beheira" | 
    "Fayoum" | "Gharbia" | "Ismailia" | "Monufia" | "Minya" | 
    "Qalyubia" | "Suez" | "Aswan" | "Assiut" | "Damietta" | 
    "Sharqia" | "Matruh" | "Luxor" | "Sohag" | "North Sinai" | "Kafr El Sheikh" | 
    "Beni Suef" | "Red Sea" | "New Valley" | "South Sinai";