
// components/AddBookModal.tsx
'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { uploadImageToImageKit } from "@/app/[locale]/utils/imagekitUpload";
import { v4 as uuid } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { BookType } from '@/types/BookType';

interface AddBookModalProps {
  onClose: () => void;
  onAdd: (addedBook: BookType) => void;
}

type genre = 
    "Fiction"| "Fantasy"| "Science Fiction"| "Mystery & Thriller"|
    "Romance"| "Historical"| "Young Adult"| "Horror"|
    "Biography"| "Personal Growth";

export default function AddBookModal({ onClose, onAdd }: AddBookModalProps ) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState<genre>('Fiction');
  const [condition, setCondition] = useState<'new' | 'used'>('new');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  // const [coverImageUrl, setCoverImageUrl] = useState('');
  const [availableFor, setAvailableFor] = useState<BookType['availableFor']>([]);
  const [price, setPrice] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (option: 'sell' | 'swap', checked: boolean) => {
    if (checked) {
      setAvailableFor([...availableFor, option]);
    } else {
      setAvailableFor(availableFor.filter((val) => val !== option));
    }
  };

  const handleAddBook = async () => {
    if (!user?.uid || !title || !author || !genre || !file) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);

  const imageUrl = await uploadImageToImageKit(file);
  if (!imageUrl) return alert("Failed to upload image");
  // setCoverImageUrl(imageUrl);

    try {
      const bookData: BookType = {
        id: uuid(),
        ownerId: user.uid,
        ownerType: user.role,
        title,
        author,
        isbn: '',
        genre,
        quantity: 1,
        averageRating: 0,
        totalRatings: 0,
        description,
        condition,
        price: availableFor.includes('sell') ? Number(price) || 0 : 0,
        availableFor,
        approval: 'pending',
        isDeleted: false,
        status: 'available',
        coverImage: imageUrl,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      

      await addDoc(collection(db, 'books'), bookData);
      toast.success('Book added successfully!');
      onAdd(bookData);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-md relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-[#b63333] text-3xl transition">×</button>
        <h2 className="text-lg font-bold mb-4">Add New Book</h2>
        {/* title */}
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input name='title' className="w-full mb-2 p-2 border rounded" placeholder="ex: The Laws of Human Nature" value={title} onChange={(e) => setTitle(e.target.value)} />
        {/* author */}
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
        <input name="author" className="w-full mb-2 p-2 border rounded" placeholder="ex: Robert Greene" value={author} onChange={(e) => setAuthor(e.target.value)} />
        {/* genre */}
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
        <select name='genre' className="w-full mb-2 p-2 border rounded" value={genre} onChange={(e) => setGenre(e.target.value as genre)}>
          <option value="Fiction">Fiction</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Mystery & Thriller">Mystery & Thriller</option>
          <option value="Romance">Romance</option>
          <option value="Historical">Historical</option>
          <option value="Young Adult">Young Adult</option>
          <option value="Horror">Horror</option>
          <option value="Biography">Biography</option>
          <option value="Personal Growth">Personal Growth</option>
        </select>
        
        {/* condition */}
        <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
        <select name='condition' className="w-full mb-2 p-2 border rounded" value={condition} onChange={(e) => setCondition(e.target.value as 'new' | 'used')}>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
        {/* description */}
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name='description' className="w-full mb-2 p-2 border rounded" placeholder="Brief description..." value={description} onChange={(e) => setDescription(e.target.value)} />
        {/* available for */}
        <label className="block text-sm font-medium text-gray-700 mb-1">Available For</label>
        <div className='flex items-center space-x-2 mt-1 mb-2'>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sell"
              className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none"
              checked={availableFor.includes("sell")}
              onChange={(e) => handleCheckboxChange("sell", e.target.checked)}
            />
            <label htmlFor="sell" className="text-sm font-medium text-gray-700">Sell</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="swap"
              className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none"
              checked={availableFor.includes("swap")}
              onChange={(e) => handleCheckboxChange("swap", e.target.checked)}
            />
            <label htmlFor="swap" className="text-sm font-medium text-gray-700">Exchange</label>
          </div>
        </div>
        
        {availableFor.includes('sell') && (
          <input type="number" className="w-full mb-2 p-2 border rounded" placeholder="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        )}
        {/* upload image */}
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Upload Cover Image</label>
        <input
          type="file"
          accept="image/*"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) {
              setFile(selected);
            }
          }}
        />

        <button
          onClick={handleAddBook}
          className="bg-[#a8775a] text-white w-full py-2 rounded hover:bg-[#946a52]"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </div>
    </div>
  );
}





