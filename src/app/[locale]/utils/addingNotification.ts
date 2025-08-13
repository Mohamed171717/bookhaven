import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Notification } from "@/types/NotificationType";

export const addNotification = async (
  notification: Omit<Notification, "id" | "timestamp">
) => {
  try {
    const notificationsRef = collection(db, "notifications");

    // Create a new notification object with the server timestamp
    const newNotification = {
      ...notification,
      timestamp: serverTimestamp(),
    };

    // Add the notification to Firestore
    const docRef = await addDoc(notificationsRef, newNotification);

    // Return the created notification with its ID
    return {
      ...newNotification,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error adding notification:", error);
    throw error;
  }
};
