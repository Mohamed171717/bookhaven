import { OrderType, ShippingInfoType } from "@/types/TransactionType";
import { CartItem } from "@/types/CartType";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuid } from "uuid";

export function createOrderObject(
  userId: string,
  buyerInfo: ShippingInfoType,
  items: CartItem[],
  paymentParams: {
    transactionId: string;
    amount_cents: string;
    currency: string;
    paymentMethod: string;
    paymentStatus: "pending" | "paid" | "failed";
    paidAt?: Date;
  }
): OrderType {
  const now = new Date();

  return {
    orderId: uuid(),
    userId,
    buyerInfo,
    items,
    status: paymentParams.paymentStatus === "paid" ? "delivered" : "pending",
    payment: {
      method: paymentParams.paymentMethod,
      transactionId: paymentParams.transactionId,
      paidAt: paymentParams.paidAt || now,
      amount: parseInt(paymentParams.amount_cents) / 100,
      currency: paymentParams.currency as "EGP",
      status: paymentParams.paymentStatus,
    },
    createdAt: now,
    updatedAt: now,
  };
}

export async function saveOrderToDb(order: OrderType) {
  const orderRef = doc(db, "orders", order.orderId);
  await setDoc(orderRef, {
    ...order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
