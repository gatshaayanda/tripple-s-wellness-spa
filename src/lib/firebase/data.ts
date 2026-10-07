import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { ServiceCategory } from "@/lib/tripple-s/catalog";

export type ServiceRecord = {
  id: string; name: string; category: ServiceCategory; description: string; price: string; duration: string; active: boolean;
  consultationRequired?: boolean; assessmentNote?: string; prep?: string; aftercare?: string;
};

export type ProductRecord = {
  id: string; name: string; description: string; size?: string; price: string; active: boolean; purchaseMethod?: string;
};

export type BookingStatus = "NEW" | "REVIEWING" | "APPROVED" | "PAYMENT_PENDING" | "CONFIRMED" | "ARRIVED" | "COMPLETED" | "NEEDS_CONTACT" | "DECLINED" | "RESCHEDULED" | "CANCELLED" | "NO_SHOW" | "FOLLOW_UP";
export type PaymentStatus = "PAYMENT_PENDING" | "PAYMENT_INSTRUCTIONS" | "PAYMENT_PROOF_SUBMITTED" | "PAYMENT_VERIFIED" | "PAID" | "REFUNDED";

export type BookingRequestRecord = {
  id: string; createdAt: string; name: string; phone: string; email?: string; serviceId?: string; serviceNameSnapshot: string;
  priceSnapshot?: string; durationSnapshot?: string; preferredDate?: string; preferredTime?: string; message?: string;
  clientType: "NEW" | "RETURNING"; referralSource?: string; status: BookingStatus; paymentStatus: PaymentStatus;
};

const servicesCollection = collection(db, "services");
const productsCollection = collection(db, "products");
const bookingCollection = collection(db, "bookingRequests");

export async function getServices(): Promise<ServiceRecord[]> {
  const snapshot = await getDocs(servicesCollection);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<ServiceRecord, "id">) }));
}

export async function getPublicServices(): Promise<ServiceRecord[]> {
  const snapshot = await getDocs(query(servicesCollection, where("active", "==", true)));
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<ServiceRecord, "id">) }));
}
export async function saveServiceRecord(item: ServiceRecord) { await setDoc(doc(db, "services", item.id), item); }
export async function deleteServiceRecord(id: string) { await deleteDoc(doc(db, "services", id)); }

export async function getPublicProducts(): Promise<ProductRecord[]> {
  const snapshot = await getDocs(query(productsCollection, where("active", "==", true)));
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<ProductRecord, "id">) }));
}

export async function getProducts(): Promise<ProductRecord[]> {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<ProductRecord, "id">) }));
}
export async function saveProductRecord(item: ProductRecord) { await setDoc(doc(db, "products", item.id), item); }
export async function deleteProductRecord(id: string) { await deleteDoc(doc(db, "products", id)); }

export async function createBookingRequest(data: Omit<BookingRequestRecord, "id">) {
  const result = await addDoc(bookingCollection, data);
  return result.id;
}
export async function getBookingRequests(): Promise<BookingRequestRecord[]> {
  const snapshot = await getDocs(bookingCollection);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<BookingRequestRecord, "id">) }));
}
export async function updateBookingStatus(id: string, status: BookingStatus) { await updateDoc(doc(db, "bookingRequests", id), { status }); }
export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus) { await updateDoc(doc(db, "bookingRequests", id), { paymentStatus }); }