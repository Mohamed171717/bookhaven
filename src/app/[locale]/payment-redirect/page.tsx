"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { saveOrderToDb, createOrderObject } from "../utils/addingOrder";
import { useAuth } from "@/context/AuthContext";
import { v4 as uuid } from "uuid";
import { getBookOwner } from "../utils/gettingOwner";
import { addNotification } from "../utils/addingNotification";
import { Notification } from "@/types/NotificationType";

export default function PaymentRedirect() {
  // const [status, setStatus] = useState<string>("");
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const { cart } = useCart();

  useEffect(() => {
    if (!user?.uid || cart.length === 0) return; // wait until data is loaded

    const success = searchParams.get("success");
    if (success !== "true") {
      router.replace("/checkout");
      return;
    }

    const transactionId = searchParams.get("id") || uuid();
    const amount_cents = searchParams.get("amount_cents") || "0";
    const currency = searchParams.get("currency") || "EGP";
    const paymentMethod = searchParams.get("source_data.type") || "unknown";

    const shippingInfoUser = JSON.parse(
      localStorage.getItem("shippingInfoUser") || "{}"
    );

    // prevent duplicate save
    if (sessionStorage.getItem("orderSaved")) return;

    const order = createOrderObject(user.uid, shippingInfoUser, cart, {
      transactionId,
      amount_cents,
      currency,
      paymentMethod,
      paymentStatus: "paid",
    });

    saveOrderToDb(order);
    sessionStorage.setItem("orderSaved", "true");

    cart.map(async (item) => {
      const owner = await getBookOwner(item.bookId);
      if (owner) {
        const notification: Notification = {
          id: uuid(),
          reciverId: owner.uid,
          title: "Sale Notification",
          type: "book_sold" as const,
          message: `${user.name} has bought Your book "${item.title}" ${
            item.quantity > 1 ? `(${item.quantity} copies)` : ""
          }`,
          senderId: user.uid,
        };
        // Save notification to the database
        await addNotification(notification);
      }
    });

    router.replace(`/payment-success`);
  }, [searchParams, cart, router, user?.uid, user?.name]);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-medium">
          Processing your payment, please wait...
        </p>
      </div>
    </>
  );
}
