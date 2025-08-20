
// context/CartContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { CartItem } from '@/types/CartType'
import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc
} from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext' // assumes you have this
import toast from 'react-hot-toast'

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const { user } = useAuth() 

  // Load cart from Firestore on login
  useEffect(() => {
    const loadCart = async () => {
      if (!user?.uid) return
      const cartRef = collection(db, 'users', user.uid, 'cartItems')
      const snapshot = await getDocs(cartRef)
      const items: CartItem[] = snapshot.docs.map((doc) => doc.data() as CartItem)
      setCart(items)
    }

    loadCart()
  }, [user?.uid])

  // Save cart to Firestore whenever cart changes (if logged in)
  useEffect(() => {
    if (!user?.uid) return;

    const saveCart = async () => {
      const cartRef = collection(db, 'users', user.uid, 'cartItems');
      // 1. Delete all existing cart items first
      const existing = await getDocs(cartRef);
      const deletePromises = existing.docs.map(docSnap => deleteDoc(docSnap.ref));
      // 2. Save updated cart
      const savePromises = cart.map(item => {
        const docRef = doc(cartRef, item.bookId);
        return setDoc(docRef, item);
      });

      await Promise.all([...deletePromises, ...savePromises]);
    };

    saveCart();
  }, [cart, user?.uid]);

  const addToCart = (item: CartItem) => {
    if(!user) return (toast.error('Please login to add to cart.'));
    if(item.quantity === 0) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.bookId === item.bookId)
      if (existing) {
        return prev.map((i) =>
          i.bookId === item.bookId ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...prev, item]
    })
    toast.success('Book added to cart')
  }

  const removeFromCart = async (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.bookId !== bookId))
    if (user?.uid) {
      await deleteDoc(doc(db, 'users', user.uid, 'cartItems', bookId))
    }
  }

  const updateQuantity = (bookId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.bookId === bookId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = async () => {
    setCart([])
    if (user?.uid) {
      const cartRef = collection(db, 'users', user.uid, 'cartItems')
      const snapshot = await getDocs(cartRef)
      const deletes = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, 'users', user.uid, 'cartItems', docSnap.id))
      )
      await Promise.all(deletes)
    }
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
