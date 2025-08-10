import { Timestamp } from "firebase/firestore";
import { CartItem } from "./CartType";

export interface SwapType {
  swapId: string;
  buyerId: string;
  sellerId: string;
  bookId: string;
  swapWithBookId?: string;
  moneyForBorrow?: string;
  chatId?: string;
  type: "borrow" | "swap";
  status?: "paid" | "completed" | "cancelled";
  requesterConfirmed?: false;
  responderConfirmed?: false;
  createdAt: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

export interface OrdeType {
  orderId: string;
  userId: string;
  buyerInfo: ShippingInfoType;
  items: CartItem[];
  status?: "pending" | "delivered" | "cancelled";
  payment: {
    method: string;
    transactionId: string;
    paidAt: Date | Timestamp;
    amount: number;
    currency: "EGP";
    status: "pending" | "paid" | "failed";
  };
  createdAt: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

export interface ShippingInfoType {
  userId: string | undefined;
  name: string;
  phone: string;
  government: string;
  city: string;
  address?: string;
  note?: string;
}

// interface CartItem {
//   bookId: string;
//   title: string;
//   author: string;
//   image: string;
//   price: number;
//   quantity: number;
// }

// {
//   "orderId": "string",                          // معرف الطلب (unique)
//   "userId": "string",                           // UID من Firebase Auth

//   "status": "string",                           // قيم مسموح بها: pending, paid, shipped, delivered, cancelled

//   "createdAt": "string (ISO 8601 datetime)",    // تاريخ إنشاء الطلب
//   "updatedAt": "string (ISO 8601 datetime)",    // تاريخ آخر تحديث

//   "items": [
//     {
//       "bookId": "string",                       // معرف الكتاب
//       "title": "string",                         // اسم الكتاب
//       "price": "number",                         // سعر الوحدة
//       "quantity": "integer",                     // عدد النسخ
//       "image": "string (URL)",                   // رابط صورة
//       "author": "string"                         // اسم المؤلف
//     }
//   ],

//   "shippingInfo": {
//     "name": "string",                            // اسم المستلم
//     "phone": "string",                           // رقم الهاتف
//     "address": "string",                         // العنوان
//     "city": "string",                            // المدينة
//     "government": "string",                      // المحافظة
//     "note": "string | null"                      // ملاحظة إضافية (اختياري)
//   },

//   "payment": {
//     "method": "string",                          // طرق الدفع: Paymob, Cash on Delivery, etc.
//     "transactionId": "string | null",            // ID المعاملة (اختياري لو الدفع كاش)
//     "paidAt": "string (ISO 8601 datetime) | null", // وقت الدفع (اختياري)
//     "amount": "number",                          // المبلغ المدفوع
//     "currency": "string",                        // العملة (EGP, USD, ...)
//     "status": "string"                           // قيم مسموح بها: pending, paid, failed
//   },

//   "totalPrice": "number"                         // إجمالي المبلغ
// }

// export interface SwapRequest {
//   id: "swapReqId123",
//   requesterId: "userA",
//   responderId: "userB",
//   requesterBookId: "bookA",
//   responderBookId: "bookB",
//   chatId: "chatId123",
//   status: "pending" | "agreed" | "completed" | "cancelled",
//   requesterConfirmed: true,
//   responderConfirmed: false,
//   createdAt: Date,
//   agreedAt: Date
// }

// payment":{"method":"Paymob","transactionId":"328696016","paidAt":"2025-08-09T23:05:54.453653Z","amount":278.2,"currency":"EGP","status":"paid","message":"","responseCode":"APPROVED"},"totalPrice":278.2}
