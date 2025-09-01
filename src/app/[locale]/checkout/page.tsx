"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import toast from "react-hot-toast";
import { useState } from "react";
import LanguageSwitcher from "@/components/layout/languageSwitcher";
import { egyptLocations } from "./egyptLocations";
import { useAuth } from "@/context/AuthContext";
import { ShippingInfoType } from "@/types/TransactionType";
import { useTranslations } from "next-intl";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("CartPage");
  const { cart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    government: "",
    note: "",
  });

  const handleGovChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // const gov = ;
    setFormData({
      ...formData,
      government: e.target.value,
      city: "",
      address: "",
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      city: e.target.value,
    });
  };

  const subTotal = cart.reduce(
    (sum, item) => sum + item.price! * item.quantity,
    0
  );
  const shiping = 5.0; // Fixed shipping cost
  const total = subTotal + shiping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.city ||
      !formData.government
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Egyptian phone number validation
    const egyptianPhoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!egyptianPhoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid Egyptian phone number");
      return;
    }

    setLoading(true);
    try {
      const shippingInfoUser: ShippingInfoType = {
        userId: user?.uid,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        government: formData.government,
        city: formData.city,
        address: formData.address,
        note: formData.note,
      };
      localStorage.setItem(
        "shippingInfoUser",
        JSON.stringify(shippingInfoUser)
      );
      // Create payment intention and get checkout URL
      const res = await fetch("/api/paymob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentData: formData,
          userId: user?.uid,
          books: cart,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error("Payment failed: " + data.error);
      }
      // end
    } catch (err) {
      toast.error("Payment failed, please try again" + err);
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <Header />
      <LanguageSwitcher />
      <div className="px-6 fix-height pt-[120px] pb-10 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-center">{t('mainCheckout')}</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          {t('paths')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                {t('shippingInfo')}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t('firstName')}
                    </label>
                    <input
                      id="fName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t('lastName')}
                    </label>
                    <input
                      id="lName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t('email')}
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="tel"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t('phone')}
                    </label>
                    <input
                      id="tel"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Government Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('government')}
                    </label>
                    <select
                      title="gov"
                      name="government"
                      value={formData.government}
                      onChange={handleGovChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                      required
                    >
                      <option value="">{t('selectgov')}</option>
                      {Object.keys(egyptLocations).map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('city')}
                    </label>
                    <select
                      title="city"
                      name="city"
                      value={formData.city}
                      onChange={handleCityChange}
                      disabled={!formData.government}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                      required
                    >
                      <option value="">{t('select')}</option>
                      {formData.government &&
                        egyptLocations[formData.government]?.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Address Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('address')}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      placeholder={t('exCity')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('note')}
                    </label>
                    <input
                      type="text"
                      name="note"
                      value={formData.note || ""}
                      onChange={handleInputChange}
                      placeholder={t('exNote')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-color text-white py-3 px-4 rounded-md font-semibold hover:bg-primary-color/90 transition duration-200 disabled:opacity-50"
                  >
                    {loading ? t('proceed') : t('pay')}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border p-6 rounded-lg bg-gray-100 shadow-sm h-fit">
            <h3 className="text-lg font-semibold mb-4">{t('order')}</h3>

            {/* Cart Items */}
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.bookId} className="flex gap-3 items-center">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500">
                      {t('quantity')} {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium text-sm">
                    {(item.price! * item.quantity).toFixed(2)} EGP
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Details */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>{t('items')}</span>
                <span>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span>{subTotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between">
                <span>{t('shipping')}</span>
                <span>5.00 EGP</span>
              </div>
              <div className="flex justify-between">
                <span>{t('taxs')}</span>
                <span>0.00 EGP</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>{t('total')}</span>
                <span>{total.toFixed(2)} EGP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
