
// context/CartContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { CartItem } from '@/types/CartType'
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

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) setCart(JSON.parse(storedCart))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.bookId === item.bookId)
      if (existing) {
        return prev.map((i) =>
          i.bookId === item.bookId ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...prev, item]
    })
    toast('Book added successfully')
  }

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.bookId !== bookId))
  }

  const updateQuantity = (bookId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.bookId === bookId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
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
