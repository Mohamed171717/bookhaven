"use client";

import Header from "@/components/layout/Header";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/types/CartType";
import { ShippingInfoType } from "@/types/TransactionType";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { IoCheckmarkDoneCircle } from "react-icons/io5";

export default function PaymentSuccessPage() {
  const { cart, clearCart } = useCart();
  const [boughtBooks, setBoughtBooks] = useState<CartItem[]>(cart);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfoType | null>(
    null
  );

  useEffect(() => {
    setBoughtBooks(cart);
    clearCart();
    const storedInfo = localStorage.getItem("shippingInfoUser");
    if (storedInfo) {
      setShippingInfo(JSON.parse(storedInfo));
    }
  }, []);

  if (!boughtBooks.length || !shippingInfo) return <p>Loading...</p>;

  const subtotal = boughtBooks.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 5;
  // const tax = 11.0;
  const total = subtotal + shipping;

  return (
    <>
      <Header />
      <div className="min-h-screen py-12 px-4 flex justify-center pt-[110px]">
        <div className="max-w-2xl w-full">
          {/* Success Icon & Title */}
          <div className="text-center mb-8">
            <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto" />
            <h1 className="text-2xl font-bold mt-4">
              Thank You For Your Purchase!
            </h1>
            <p className="text-gray-600">Your order details are below</p>
          </div>

          {/* Order Details */}
          <div className="rounded-xl shadow-lg p-6 mb-6 border">
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <p>
                Order Number <span className="font-medium">#{Date.now()}</span>
              </p>
              <p>
                Order Date{" "}
                <span className="font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </p>
            </div>

            {/* Items */}
            {boughtBooks.map((item) => (
              <div
                key={item.bookId}
                className="flex items-center justify-between py-4 border-b border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <Image
                    width={200}
                    height={200}
                    src={item.coverImage}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <span className="inline-block mt-1 text-xs bg-[#B17457] text-white px-2 py-0.5 rounded">
                      Qty: {item.quantity}
                    </span>
                    <p className="text-gray-500 text-sm mt-1">
                      {item.price.toFixed(2)} EGP per unit
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  {(item.price * item.quantity).toFixed(2)} EGP
                </p>
              </div>
            ))}

            {/* Totals */}
            <div className="bg-[#D8D2C2] text-black rounded-md p-4 mt-4 text-sm ">
              <div className="flex justify-between mb-1">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Shipping</span>
                <span>{shipping.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between mb-1">
                {/* <span>Tax</span> */}
                {/* <span>{tax.toFixed(2)} EGP</span> */}
              </div>
              <div className="border-t border-white mt-2 pt-2 flex justify-between font-bold">
                <span>Total Paid</span>
                <span>{total.toFixed(2)} EGP</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border">
            <h2 className="font-semibold mb-2">Delivery Information</h2>
            {/* <p className="text-sm text-gray-600">
              Estimated Delivery:{" "}
              {new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </p> */}
            <p className="mt-1 text-sm text-gray-600">
              Your books will be shipped via standard delivery
            </p>
            <div className="mt-4 text-sm">
              <p>{shippingInfo.name}</p>
              <p>{shippingInfo.phone}</p>
              <p>
                {shippingInfo.address}, {shippingInfo.city},{" "}
                {shippingInfo.government}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/"
              className="bg-[#b6784b] text-white px-6 py-2 rounded-lg shadow hover:bg-[#a76a3d]"
            >
              Back to Home
            </Link>
            {/* <button className="text-[#b6784b] hover:underline">
              View Order Details
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
}
