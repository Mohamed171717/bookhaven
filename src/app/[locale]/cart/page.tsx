
// app/cart/page.tsx or app/cart/CartPage.tsx
'use client';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { useCart } from '@/context/CartContext';
import { FaTrash } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link';


const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const subTotal = cart.reduce((sum, item) => sum + item.price! * item.quantity, 0);
  const shiping = 5.00; // Fixed shipping cost
  const total = subTotal + shiping;

  return (
    <>
    <Header/>
    <div className="p-6 fix-height max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-center">Shopping Cart</h2>
      <p className="text-sm text-gray-500 text-center mb-6">Home / Shopping Cart</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <table className="w-full border rounded-lg overflow-hidden text-left">
            <thead className="bg-primary-color text-white text-sm">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Subtotal</th>
                <th className="p-4 text-center">Remove</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {cart.map((item) => (
                <tr key={item.bookId} className="border-b">
                  <td className="p-4 flex gap-4 items-center">
                    <Image src={item.coverImage} alt={item.title} width={60} height={60} className="rounded-md" />
                    <div>
                      <div className="font-medium text-lg">{item.title}</div>
                      <div className="text-sm text-gray-500">Author: {item.author}</div>
                    </div>
                  </td>
                  <td className="p-4">${item.price!.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 bg-gray-200 rounded text-lg"
                        onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="px-2 bg-gray-200 rounded text-lg"
                        onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-4 font-medium">${(item.price! * item.quantity).toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => removeFromCart(item.bookId)}>
                      <FaTrash className="w-4 h-4 text-red-700 hover:text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Clear All Button */}
          {cart.length > 0 && (
            <div className="flex justify-end mt-4">
              <button
                onClick={clearCart}
                className="text-white text-sm py-2 px-3 font-semibold rounded transition bg-primary-color hover:bg-red-600"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="border p-6 rounded-lg bg-white shadow-sm h-fit">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between py-2">
            <span>Items</span>
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Sub Total</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Shipping</span>
            <span>$5.00</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Taxes</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between py-4 font-semibold text-lg border-t mt-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link href='/checkout'>
            <button className="w-full bg-primary-color text-white py-2 rounded">Proceed to Checkout</button>
          </Link>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CartPage;
