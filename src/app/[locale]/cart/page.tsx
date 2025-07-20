
// app/cart/page.tsx or app/cart/CartPage.tsx
'use client';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Image from 'next/image';

const cartItems = [
  {
    id: 1,
    name: 'Wooden Sofa Chair',
    color: 'Gray',
    price: 80,
    quantity: 4,
    image: '/images/books1.jpeg',
  },
  {
    id: 2,
    name: 'Red Gaming Chair',
    color: 'Black',
    price: 90,
    quantity: 2,
    image: '/images/books2.jpeg',
  },
  {
    id: 3,
    name: 'Swivel Chair',
    color: 'Light Brown',
    price: 60,
    quantity: 1,
    image: '/images/books3.jpeg',
  },
  {
    id: 4,
    name: 'Circular Sofa Chair',
    color: 'Brown',
    price: 90,
    quantity: 2,
    image: '/images/books4.jpeg',
  },
];

const CartPage = () => {
  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 100;
  const total = subTotal - discount;

  return (
    <>
    <Header/>
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-center">Shopping Cart</h2>
      <p className="text-sm text-gray-500 text-center mb-6">Home / Shopping Cart</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <table className="w-full border rounded-lg overflow-hidden text-left">
            <thead className="bg-gray-800 text-white text-sm">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Subtotal</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {cartItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4 flex gap-4 items-center">
                    <Image src={item.image} alt={item.name} width={60} height={60} className="rounded-md" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">Color: {item.color}</div>
                    </div>
                  </td>
                  <td className="p-4">${item.price.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="px-2 bg-gray-200 rounded">−</button>
                      <span>{item.quantity}</span>
                      <button className="px-2 bg-gray-200 rounded">+</button>
                    </div>
                  </td>
                  <td className="p-4 font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Coupon */}
          <div className="mt-4 flex items-center gap-4">
            <input
              type="text"
              placeholder="Coupon Code"
              className="border px-4 py-2 rounded w-1/3"
            />
            <button className="bg-gray-800 text-white px-4 py-2 rounded">Apply Coupon</button>
            <button className="text-gray-600 hover:text-red-500">Clear Shopping Cart</button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border p-6 rounded-lg bg-white shadow-sm h-fit">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between py-2">
            <span>Items</span>
            <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Sub Total</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Shipping</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Taxes</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between py-2 text-green-600">
            <span>Coupon Discount</span>
            <span>- ${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-4 font-semibold text-lg border-t mt-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="w-full bg-gray-800 text-white py-2 rounded">Proceed to Checkout</button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CartPage;
