
'use client';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { UserType } from '@/types/UserType';
import { uploadImageToImageKit } from '@/app/[locale]/utils/imagekitUpload';
import { useTranslations } from 'next-intl';
import { FiUpload } from 'react-icons/fi';

interface Props {
  onClose: () => void;
  onUpdate: (updatedUser: UserType) => void;
} 

export default function EditProfileModal({ onClose, onUpdate }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [address, setAddress] = useState(user?.address || '');
  const [photoUrl, setPhotoUrl] = useState<File | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(user?.genres || []);
  const t = useTranslations('ProfilePage');
  const s = useTranslations('ShopPage');

  const genreOptions = [
    s('fiction'), s('fantasy'), s('science fiction'), s('mystery & thriller'),
    s('romance'), s('historical'), s('young adult'), s('horror'),
    s('biography'), s('personal growth'),
  ];

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const handleUpdate = async () => {
    if (!user?.uid) return;

    let imageUrl = user.photoUrl;
    if (photoUrl) {
      const uploadedUrl = await uploadImageToImageKit(photoUrl);
      if (!uploadedUrl) return alert("Failed to upload image");
      imageUrl = uploadedUrl;
    }
    try { 
      const ref = doc(db, 'users', user.uid);
      const updatedData = {
        name,
        bio,
        address,
        genres: selectedGenres,
        photoUrl: imageUrl,
        updatedAt: new Date(),
      };
      await updateDoc(ref, updatedData);

      toast.success('Profile updated!');
      onUpdate({ ...user, ...updatedData });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div style={{margin: 0}} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-2xl">
        <h2 className="text-xl font-bold mb-4">{t('editProfile')}</h2>
        {/* name */}
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
        <input
          name='name'
          type="text"
          placeholder={t('name')}
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg mb-3"
        />
        {/* bio */}
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">{t('bio')}</label>
        <input
          name='bio'
          type="text"
          placeholder={t('bio')}
          value={bio}
          onChange={e => setBio(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-3"
        />
        {/* address */}
        {user!.role === 'library' && (
          <>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">{t('editAddress')}</label>
            <input
              name='address'
              type="text"
              placeholder={t('address')}
              value={user!.address || ''}
              onChange={e => setAddress(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg mb-3"
            />
          </>
        )}
        {/* uploud file */}
        <label
          htmlFor="file"
          className="flex items-center w-full mb-3 mt-1 bg-white transition gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <FiUpload className="text-xl" />
          <span>{photoUrl ? photoUrl.name : t('uploadProfile')}</span>
        </label>
        <input
          id='file'
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) {
              setPhotoUrl(selected);
            }
          }}
        />
        {/* genres */}
        { user!.role === 'reader' && (
        <div className="mb-4">
          <label className="font-medium mb-2 block">{t('favoriteGenres')}</label>
          <div className="grid grid-cols-2 gap-2">
            {genreOptions.map((genre, i) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className='appearance-none w-4 h-4 border-2 border-gray-300 rounded-sm checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none'
                  checked={selectedGenres.includes(genre)}
                  onChange={() => toggleGenre(genre)}
                />
                {genre}
              </label>
            ))}
          </div>
        </div>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={handleUpdate} className="px-4 py-2 rounded-full bg-btn-color text-gray-50 hover:bg-[#4A4947] transition text-sm">{t('save')}</button>
          <button onClick={onClose} className="px-4 py-2 rounded-full text-gray-50 bg-[#d63d3d] hover:bg-[#b33333] text-sm">{t('cancel')}</button>
        </div>
      </div>
    </div>
  );
}
