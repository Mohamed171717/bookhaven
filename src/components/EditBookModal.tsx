
'use client';

import { useState } from 'react';
import { BookType } from '@/types/BookType';
import { doc, updateDoc } from 'firebase/firestore';
import { uploadImageToImageKit } from "@/app/[locale]/utils/imagekitUpload";
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

interface EditBookModalProps {
  book: BookType;
  onClose: () => void;
  onUpdate: (updatedBook: BookType) => void;
}

const genres = [
  'Fiction', 'Fantasy', 'Science Fiction', 'Mystery & Thriller',
  'Romance', 'Historical', 'Young Adult', 'Horror',
  'Biography', 'Personal Growth',
];

const conditions: BookType['condition'][] = ['new', 'used'];

export default function EditBookModal({ book, onClose, onUpdate }: EditBookModalProps) {

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [genre, setGenre] = useState(book.genre);
  const [file, setFile] = useState<File | null>(null);
  const [condition, setCondition] = useState(book.condition || '');
  const [description, setDescription] = useState(book.description || '');
  const [price, setPrice] = useState(book.price);

  
  const handleSave = async () => {
    let imageUrl = book.coverImage;

    if (file) {
      const uploadedUrl = await uploadImageToImageKit(file);
      if (!uploadedUrl) return alert("Failed to upload image");
      imageUrl = uploadedUrl;
    }
    try {
      const bookRef = doc(db, 'books', book.id);
      const updatedData = {
        title,
        author,
        genre,
        condition,
        description,
        coverImage: imageUrl,
        price: price,
        updatedAt: new Date(),
      };

      await updateDoc(bookRef, updatedData);
      toast.success('Book updated successfully');
      onUpdate({ ...book, ...updatedData });
      onClose();
    } catch (err) {
      toast.error('Failed to update book');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-[#b63333] text-3xl transition">×</button>
        <h2 className="text-lg font-bold mb-4">Edit Book</h2>

        <div className="space-y-3">
          {/* title */}
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" placeholder="Title" />
          {/* author */}
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-2 border rounded" placeholder="Author" />
          {/* genre */}
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full p-2 border rounded">
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          {/* condition */}
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value as BookType['condition'])} className="w-full p-2 border rounded">
            <option disabled value="">Select Condition</option>
            {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {/* description */}
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded resize-none" rows={3} placeholder="Description" />
          {/* price */}
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full p-2 border rounded" placeholder="Price" />
          {/* uploud file */}
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

          <button onClick={handleSave} className="bg-[#B17457] text-white w-full py-2 rounded hover:bg-[#4A4947] transition mt-2">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
