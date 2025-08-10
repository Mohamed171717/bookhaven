"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import { saveOrderToDb, createOrderObject } from "../utils/addingOrder";
import { useAuth } from "@/context/AuthContext";
// import { ShippingInfoType } from "@/types/TransactionType";

export default function PaymentRedirect() {
  // const [status, setStatus] = useState<string>("");
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const { cart } = useCart();
  console.log(cart);

  useEffect(() => {
    const success = searchParams.get("success");
    const transactionId = searchParams.get("id") || "";
    const amount_cents = searchParams.get("amount_cents") || "0";
    const currency = searchParams.get("currency") || "EGP";
    const paymentMethod = searchParams.get("source_data.type") || "unknown";

    const shippingInfoUser = JSON.parse(
      localStorage.getItem("shippingInfoUser") || "{}"
    );

    if (success === "true") {
      const paramsObj: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        paramsObj[key] = value;
      });
      console.log(searchParams);

      const order = createOrderObject(user?.uid || "", shippingInfoUser, cart, {
        transactionId,
        amount_cents,
        currency,
        paymentMethod,
        paymentStatus: "paid",
      });

      saveOrderToDb(order);

      router.replace(`/payment-success`);
    } else {
      // Payment failed → back to checkout
      router.replace("/checkout");
    }
  }, [searchParams, cart, router, user?.uid]);

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-medium">
          Processing your payment, please wait...
        </p>
      </div>
    </>
  );
}
