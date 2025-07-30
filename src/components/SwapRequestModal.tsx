
'use client';
import React, { useState } from 'react';
import { BookType } from '@/types/BookType';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSwap: (selectedBook: BookType) => void;
  myBooks: BookType[];
  targetBook: BookType;
};

export default function SwapRequestModal({
  isOpen,
  onClose,
  onSubmitSwap,
  myBooks,
  targetBook,
}: Props) {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const handleSubmit = () => {
    const selected = myBooks.find((b) => b.id === selectedBookId);
    if (selected) {
      onSubmitSwap(selected);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold">
              Swap for: <span className="text-primary">{targetBook.title}</span>
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>

          {myBooks.length === 0 ? (
            <p className="text-sm text-gray-500">You have no books available for swap.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
              {myBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => setSelectedBookId(book.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    selectedBookId === book.id
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={book.coverImage || '/placeholder.png'}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="text-sm font-semibold">{book.title}</h4>
                      <p className="text-xs text-gray-500">{book.author}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              disabled={!selectedBookId}
              onClick={handleSubmit}
              className="px-4 py-2 rounded-full bg-btn-color text-white text-sm font-medium disabled:opacity-50"
            >
              Send Swap Request
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
