// components/AddBookModal.tsx
"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { uploadImageToImageKit } from "@/app/[locale]/utils/imagekitUpload";
import { v4 as uuid } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { BookType, Genre, Location } from '@/types/BookType';
import { useTranslations } from "next-intl";

interface AddBookModalProps {
  onClose: () => void;
  onAdd: (addedBook: BookType) => void;
}

export default function AddBookModal({ onClose, onAdd }: AddBookModalProps ) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState<Genre>('Fiction');
  const [location, setLocation] = useState<Location>('Cairo');
  const [condition, setCondition] = useState<'new' | 'used'>('new');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [availableFor, setAvailableFor] = useState<BookType["availableFor"]>([]);
  const [price, setPrice] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations('ProfilePage');
  const s = useTranslations('ShopPage');

  const handleCheckboxChange = (option: "sell" | "swap", checked: boolean) => {
    if (checked) {
      setAvailableFor([...availableFor, option]);
    } else {
      setAvailableFor(availableFor.filter((val) => val !== option));
    }
  };

  const handleAddBook = async () => {
    if (!user?.uid || !title || !author || !genre || !file || files.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    // Check with role
    if (user.role === "library" && !price) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (user.role === "library") availableFor.push('sell')
    if (user.role === "reader" && availableFor.length === 0) {
      toast.error("Please select at least one option for available for");
      return;
    }
    setLoading(true);

    const imageUrl = await uploadImageToImageKit(file);
    const imageUrls = await Promise.all(
      files.map(async (img) => {
        const url = await uploadImageToImageKit(img);
        return url;
      })
    );
    if (!imageUrl || imageUrls.length === 0) return alert("Failed to upload image");

    const generatedId = uuid();
    try {
      const bookData: BookType = {
        id: generatedId,
        ownerId: user.uid,
        ownerType: user.role,
        title,
        author,
        isbn: "",
        genre,
        location,
        quantity: quantity ? Number(quantity) : 1,
        averageRating: 0,
        totalRatings: 0,
        description,
        condition,
        price: availableFor.includes("sell") ? Number(price) || 0 : 0,
        availableFor,
        approval: "pending",
        isDeleted: false,
        status: "available",
        coverImage: imageUrl,
        images: imageUrls,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, "books", generatedId), bookData);
      toast.success("Book added successfully!");
      onAdd(bookData);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 pt-10 rounded-lg max-w-2xl w-full shadow-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-[#b63333] text-3xl transition"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4">{t('addBook')}</h2>
        {/* title */}
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('title')}
        </label>
        <input
          name="title"
          className="w-full mb-2 p-2 border rounded"
          placeholder={t('exTitle')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* author */}
        <label
          htmlFor="author"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('author')}
        </label>
        <input
          name="author"
          className="w-full mb-2 p-2 border rounded"
          placeholder={t('exAuthor')}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        {/* description */}
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('description')}
        </label>
        <textarea
          name="description"
          className="w-full mb-2 p-2 border rounded"
          placeholder={t('preifDesc')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* locations */}
        { user!.role === 'reader' && (
          <>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">{t('location')}</label>
          <select name='location' className="w-full mb-2 p-2 border rounded" value={location} onChange={(e) => setLocation(e.target.value as Location)}>
            <option value="Cairo">Cairo</option>
            <option value="Giza">Giza</option>
            <option value="Alexandria">Alexandria</option>
            <option value="Dakahlia">Dakahlia</option>
            <option value="Red Sea">Red Sea</option>
            <option value="Beheira">Beheira</option>
            <option value="Fayoum">Fayoum</option>
            <option value="Gharbia">Gharbia</option>
            <option value="Ismailia">Ismailia</option>
            <option value="Monufia">Monufia</option>
            <option value="Minya">Minya</option>
            <option value="Qalyubia">Qalyubia</option>
            <option value="New Valley">New Valley</option>
            <option value="Suez">Suez</option>
            <option value="Aswan">Aswan</option>
            <option value="Assiut">Assiut</option>
            <option value="Beni Suef">Beni Suef</option>
            <option value="Damietta">Damietta</option>
            <option value="Sharqia">Sharqia</option>
            <option value="South Sinai">South Sinai</option>
            <option value="Kafr El Sheikh">Kafr El Sheikh</option>
            <option value="Matruh">Matruh</option>
            <option value="Luxor">Luxor</option>
            <option value="Sohag">Sohag</option>
            <option value="North Sinai">North Sinai</option>
          </select>
          </>
        )}
        
        {/* condition */}
        <label
          htmlFor="condition"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('condition')}
        </label>
        <select
          title="type condition"
          name="condition"
          className="w-full mb-2 p-2 border rounded"
          value={condition}
          onChange={(e) => setCondition(e.target.value as "new" | "used")}
        >
          <option value="new">{s('new')}</option>
          <option value="used">{s('used')}</option>
        </select>
        {/* genre */}
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">{t('genre')}</label>
        <select name='genre' className="w-full mb-2 p-2 border rounded" value={genre} onChange={(e) => setGenre(e.target.value as Genre)}>
          <option value="fiction">{s('fiction')}</option>
          <option value="fantasy">{s('fantasy')}</option>
          <option value="science fiction">{s('science fiction')}</option>
          <option value="mystery & thriller">{s('mystery & thriller')}</option>
          <option value="romance">{s('romance')}</option>
          <option value="historical">{s('historical')}</option>
          <option value="young adult">{s('young adult')}</option>
          <option value="horror">{s('horror')}</option>
          <option value="biography">{s('biography')}</option>
          <option value="personal growth">{s('personal growth')}</option>
        </select>
        {/* available for */}
        { user!.role === 'reader' ? (
        <>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {s('avilable')}
        </label>
        <div className="flex items-center space-x-2 mt-1 mb-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sell"
              className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none"
              checked={availableFor.includes("sell")}
              onChange={(e) => handleCheckboxChange("sell", e.target.checked)}
            />
            <label htmlFor="sell" className="text-sm font-medium text-gray-700">
              {s('sell')}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="swap"
              className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none"
              checked={availableFor.includes("swap")}
              onChange={(e) => handleCheckboxChange("swap", e.target.checked)}
            />
            <label htmlFor="swap" className="text-sm font-medium text-gray-700">
              {s('exchange')}
            </label>
          </div>
        </div>
        {availableFor.includes("sell") && (
          <input
            title={t('pricebook')}
            type="number"
            className="w-full mb-2 p-2 border rounded"
            placeholder={s('price')}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        )}
        </>
        ) : (
          <>
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            {s('price')}
          </label>
          <input
            id="price"
            title={t('pricebook')}
            type="number"
            className="w-full mb-2 p-2 border rounded"
            placeholder={s('price')}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          </>
        )}
        {/* quantity */}
        { user?.role === 'library' && (
          <>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            {t('quantity')}
          </label>
          <input
            id="quantity"
            type="number"
            className="w-full mb-2 p-2 border rounded"
            placeholder={t('quantity')}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
          />
          </>
        )}
        {/* upload image */}
        <label
          htmlFor="file"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('upload')}
        </label>
        <input
          id="file"
          title="upload the book image"
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
        {/* upload images */}
        <label
          htmlFor="files"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t('uploads')}
        </label>
        <input
          id="files"
          title="upload the book image"
          type="file"
          multiple
          accept="image/*"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || []);
            if (selectedFiles.length > 4) {
              toast.error("You can upload up to 4 images only.");
              return;
            }
            setFiles(selectedFiles);
          }}
        />

        <button
          onClick={handleAddBook}
          className="bg-[#a8775a] text-white w-full py-2 rounded hover:bg-[#946a52]"
          disabled={loading}
        >
          {loading ? t('adding') : t('addBook')}
        </button>
      </div>
    </div>
  );
}
