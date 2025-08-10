import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { Notification } from "@/types/NotificationType";

export const createNotification = async (
  notification: Omit<Notification, "id" | "timestamp" | "read">
) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const newNotification = {
      ...notification,
      timestamp: serverTimestamp(),
      read: false,
    };

    const docRef = await addDoc(notificationsRef, newNotification);
    return { ...newNotification, id: docRef.id };
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
