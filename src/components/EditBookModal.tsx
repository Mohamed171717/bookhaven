
'use client';

import { useState } from 'react';
import { BookType, Genre } from '@/types/BookType';
import { doc, updateDoc } from 'firebase/firestore';
import { uploadImageToImageKit } from "@/app/[locale]/utils/imagekitUpload";
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { FiUpload } from 'react-icons/fi';

interface EditBookModalProps {
  book: BookType;
  onClose: () => void;
  onUpdate: (updatedBook: BookType) => void;
}

export default function EditBookModal({ book, onClose, onUpdate }: EditBookModalProps) {

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [genre, setGenre] = useState(book.genre);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState(book.description || '');
    const t = useTranslations('ProfilePage');
    const s = useTranslations('ShopPage');
  
    const genres = [
      s('fiction'), s('fantasy'), s('science fiction'), s('mystery & thriller'),
      s('romance'), s('historical'), s('young adult'), s('horror'),
      s('biography'), s('personal growth'),
    ];


  
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
        description,
        coverImage: imageUrl,
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
      <div className="bg-white p-6 pt-10 rounded-xl w-full max-w-2xl shadow-xl relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-[#b63333] text-3xl transition">×</button>
        <h2 className="text-lg font-bold mb-4">{t('editBook')}</h2>

        <div className="space-y-3">
          {/* title */}
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">{t('title')}</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded-lg" placeholder={t('title')} />
          {/* author */}
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">{t('author')}</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-2 border rounded-lg" placeholder={t('author')} />
          {/* genre */}
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">{t('genre')}</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value as Genre)} className="w-full p-2 border rounded-lg">
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          {/* description */}
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('description')}</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-lg resize-none" rows={3} placeholder={t('description')} />
          {/* uploud file */}
          <label
            htmlFor="file"
            className="flex items-center w-full mb-3 mt-1 bg-white transition gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <FiUpload className="text-xl" />
            <span>{file ? file.name : t('upload')}</span>
          </label>
          <input
            id='file'
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                setFile(selected);
              }
            }}
          />

          <button onClick={handleSave} className="bg-[#B17457] text-white w-full py-2 rounded-lg hover:bg-[#4A4947] transition mt-2">
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}
