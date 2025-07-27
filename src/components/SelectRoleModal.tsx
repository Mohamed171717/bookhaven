

'use client';
import { useState } from 'react';

interface SelectRoleModalProps {
  onSelect: (role: 'reader' | 'library') => void;
  onClose: () => void;
}

export default function SelectRoleModal({ onSelect, onClose }: SelectRoleModalProps) {
  const [selected, setSelected] = useState<'reader' | 'library' | null>(null);

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Choose your role</h2>
        <div className="flex flex-col gap-4">
          <button
            className={`p-3 rounded-md border ${
              selected === 'reader' ? 'bg-[#B17457] text-white' : 'bg-gray-100'
            }`}
            onClick={() => setSelected('reader')}
          >
            Reader
          </button>
          <button
            className={`p-3 rounded-md border ${
              selected === 'library' ? 'bg-[#B17457] text-white' : 'bg-gray-100'
            }`}
            onClick={() => setSelected('library')}
          >
            Library
          </button>
        </div>
        <div className="mt-6 flex justify-between">
          <button className="bg-red-600 text-[15px] hover:bg-red-700 text-gray-50 py-2 px-4 rounded-full transition duration-300" onClick={onClose}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="bg-btn-color text-[15px] hover:bg-[#a16950] text-gray-50 py-2 px-4 rounded-full transition duration-300 disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
