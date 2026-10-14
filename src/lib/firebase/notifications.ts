"use client";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";
import { app } from "@/lib/firebase/client";
let messagingPromise: Promise<Messaging | null> | null = null;
export async function getMessagingInstance() {
 if (!messagingPromise) messagingPromise = isSupported().then((supported) => supported ? getMessaging(app) : null);
 const value = await messagingPromise;
 if (!value) throw new Error("Push notifications are not supported by this browser.");
 return value;
}
