import { CartItem } from "@/types/CartType";
import axios from "axios";
// import { ShippingInfoType } from "@/types/TransactionType";
const SECRET_KEY = process.env.NEXT_PUBLIC_PAYMOB_SECRET_KEY;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY;

interface PaymentDataType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string | null;
  city: string;
  government: string;
}

export async function createPaymentIntention(
  paymentData: PaymentDataType,
  userId: string | undefined,
  books: CartItem[]
) {
  try {
    console.log("Payment Data received:", paymentData);

    const shippingFee = 500; // 5 EGP in cents

    // Build cart items for Paymob
    const items = books.map((book: CartItem) => ({
      name: book.title || "Untitled book",
      amount: Math.round(book.price! * 100), // price in cents
      description: book.bookId || "Book purchase",
      quantity: book.quantity || 1,
    }));

    // Add shipping as a separate item
    items.push({
      name: "Shipping Fee",
      amount: shippingFee,
      description: "Standard delivery",
      quantity: 1,
    });

    // Calculate total from the items array to avoid mismatches
    const totalAmount = items.reduce(
      (sum, item) => sum + item.amount * item.quantity,
      0
    );

    const payload = {
      amount: totalAmount,
      currency: "EGP",
      payment_methods: [5226437], // Replace with your actual Paymob payment method ID
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
      redirection_url: `${window.location.origin}/payment-redirect`,
      extras: {
        userId,
        ...paymentData,
      },
      items,
    };

    console.log("Final Payload:", payload);

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
    console.log("Client Secret:", clientSecret);

    const checkoutUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${PUBLIC_KEY}&clientSecret=${clientSecret}`;
    window.location.href = checkoutUrl;

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Payment error:", error.response?.data || error.message);
    throw new Error("Payment failed");
  }
}
