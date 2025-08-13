"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useCart } from "@/context/CartContext";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
// import { useBooks } from '@/context/BooksContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const t = useTranslations('CartPage');
  const router = useRouter();
  // const { books } = useBooks();
  const subTotal = cart.reduce(
    (sum, item) => sum + item.price! * item.quantity,
    0
  );
  const shiping = 5.0;
  const total = subTotal + shiping;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error(
        "Your cart is empty. Please add items to your cart before proceeding to checkout."
      );
      return;
    }
    router.push("/checkout");
  };

  return (
    <>
      <Header />
      <div className="px-4 md:px-6 cart-height pt-[174px] pb-10 max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-center">
          {t('shopCart')}
        </h2>
        <p className="text-xs md:text-sm text-gray-500 text-center mb-4 md:mb-6">
          {t('path')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full border rounded-lg overflow-hidden text-left">
                <thead className="bg-primary-color text-white text-sm">
                  <tr>
                    <th className="p-4">{t('prod')}</th>
                    <th className="p-4">{t('price')}</th>
                    <th className="p-4">{t('quantity')}</th>
                    <th className="p-4">{t('subtotal')}</th>
                    <th className="p-4 text-center">{t('remove')}</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100 shadow-lg">
                  {cart.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center p-6 text-gray-500">
                        {t('empty')}
                      </td>
                    </tr>
                  )}
                  {cart.map((item) => (
                    <tr key={item.bookId} className="border-b">
                      <td className="p-4 flex gap-4 items-center">
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          width={60}
                          height={60}
                          className="rounded-md"
                        />
                        <div>
                          <div className="font-medium text-lg">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {t('author')} {item.author}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{item.price!.toFixed(2)} EGP</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 bg-gray-200 rounded text-lg"
                            onClick={() =>
                              updateQuantity(item.bookId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="px-2 bg-gray-200 rounded text-lg"
                            onClick={() =>
                              updateQuantity(item.bookId, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4 font-medium">
                        {(item.price! * item.quantity).toFixed(2)} EGP
                      </td>
                      <td className="p-4 text-center">
                        <button
                          title="Remove"
                          onClick={() => removeFromCart(item.bookId)}
                        >
                          <FaTrash className="w-4 h-4 text-red-700 hover:text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cart Items */}
            <div className="md:hidden space-y-4">
              {cart.map((item) => (
                <div
                  key={item.bookId}
                  className="bg-gray-100 rounded-lg p-4 shadow-md"
                >
                  <div className="flex gap-3 items-start">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      width={60}
                      height={60}
                      className="rounded-md flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm md:text-base">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('author')} {item.author}
                      </div>
                      <div className="text-sm font-medium mt-1">
                        {item.price!.toFixed(2)} EGP
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 bg-gray-200 rounded text-sm"
                            onClick={() =>
                              updateQuantity(item.bookId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            className="px-2 bg-gray-200 rounded text-sm"
                            // disabled={item.quantity >= book.quantity}
                            onClick={() =>
                              updateQuantity(item.bookId, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {(item.price! * item.quantity).toFixed(2)} EGP
                          </span>
                          <button
                            title="Remove"
                            onClick={() => removeFromCart(item.bookId)}
                          >
                            <FaTrash className="w-4 h-4 text-red-700 hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear All Button */}
            {cart.length > 0 && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearCart}
                  className="text-white text-xs md:text-sm py-2 px-3 font-semibold rounded transition bg-primary-color hover:bg-red-600"
                >
                  {t('clear')}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border p-4 md:p-6 rounded-lg bg-gray-100 shadow-sm h-fit">
            <h3 className="text-base md:text-lg font-semibold mb-4">
              {t('order')}
            </h3>
            <div className="flex justify-between py-2 text-sm">
              <span>{t('items')}</span>
              <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span>{t('subtotal')}</span>
              <span>{subTotal.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span>{t('shipping')}</span>
              <span>5.00 EGP</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span>{t('taxs')}</span>
              <span>0.00 EGP</span>
            </div>
            <div className="flex justify-between py-4 font-semibold text-base md:text-lg border-t mt-4">
              <span>{t('total')}</span>
              <span>{total.toFixed(2)} EGP</span>
            </div>
            <div onClick={handleCheckout}>
              <button className="w-full bg-btn-color hover:bg-[#4A4947] transition text-white py-2 rounded text-sm md:text-base">
                {t('checkout')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
