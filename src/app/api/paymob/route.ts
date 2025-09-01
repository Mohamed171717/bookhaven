

import { NextResponse } from "next/server";
import axios from "axios";
import { CartItem } from "@/types/CartType";

const SECRET_KEY = process.env.NEXT_PUBLIC_PAYMOB_SECRET_KEY!;

interface PaymentDataType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string | null;
  city: string;
  government: string;
}

export interface PaymentRequestBody {
  paymentData: PaymentDataType;
  userId?: string;
  books: CartItem[];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PaymentRequestBody;
    console.log("Received body:", body);
    const { paymentData, userId, books } = body;

    const shippingFee = 500; // 5 EGP in cents

    const items = books.map((book: CartItem) => ({
      name: book.title || "Untitled book",
      amount: Math.round(book.price! * 100),
      description: book.bookId || "Book purchase",
      quantity: book.quantity || 1,
    }));

    items.push({
      name: "Shipping Fee",
      amount: shippingFee,
      description: "Standard delivery",
      quantity: 1,
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + item.amount * item.quantity,
      0
    );

    const payload = {
      amount: totalAmount,
      currency: "EGP",
      payment_methods: [5226437],
      billing_data: {
        first_name: paymentData.firstName,
        last_name: paymentData.lastName,
        email: paymentData.email,
        phone_number: paymentData.phone,
        apartment: "NA",
        floor: "NA",
        street: paymentData.address || "NA",
        building: "NA",
        shipping_method: "NA",
        postal_code: "NA",
        city: paymentData.city,
        country: "EG",
        state: paymentData.government,
      },
      redirection_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-redirect`,
      extras: {
        userId,
        ...paymentData,
      },
      items,
    };

    const response = await axios.post(
      "https://accept.paymob.com/v1/intention/",
      payload,
      {
        headers: {
          Authorization: `Token ${SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const clientSecret = response.data.client_secret;
    return NextResponse.json({
      checkoutUrl: `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`,
      data: response.data,
    });
  } catch (error: any) {
    console.error("Paymob error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message || "Payment failed" },
      { status: 500 }
    );
  }
}
