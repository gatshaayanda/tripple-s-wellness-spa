import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { trippleSProductSeed, trippleSServiceSeed, type ServiceCategory } from "@/lib/tripple-s/catalog";
import { defaultClinicSettings, type ClinicSettings } from "@/lib/tripple-s/clinic-settings";

export type ServiceRecord = {
  id: string; name: string; category: ServiceCategory; description: string; price: string; duration: string; active: boolean;
  consultationRequired?: boolean; assessmentNote?: string; prep?: string; aftercare?: string; imageUrl?: string;
};

export type ProductRecord = {
  id: string; name: string; description: string; size?: string; price: string; active: boolean; purchaseMethod?: string; imageUrl?: string;
};

export type BookingStatus = "NEW" | "REVIEWING" | "APPROVED" | "PAYMENT_PENDING" | "CONFIRMED" | "ARRIVED" | "COMPLETED" | "NEEDS_CONTACT" | "DECLINED" | "RESCHEDULED" | "CANCELLED" | "NO_SHOW" | "FOLLOW_UP";
export type PaymentStatus = "PAYMENT_PENDING" | "PAYMENT_INSTRUCTIONS" | "PAYMENT_PROOF_SUBMITTED" | "PAYMENT_VERIFIED" | "PAID" | "REFUNDED";

export type BookingRequestRecord = {
  id: string; createdAt: string; name: string; phone: string; email?: string; serviceId?: string; serviceNameSnapshot: string;
  priceSnapshot?: string; durationSnapshot?: string; preferredDate?: string; preferredTime?: string; message?: string; discountCodeSnapshot?: string; discountAmountSnapshot?: number; finalPriceSnapshot?: string;
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
  try {
    const [snapshot, catalogueState] = await Promise.all([getDocs(servicesCollection), getDoc(doc(db, "settings", "catalogueState"))]);
    if (snapshot.empty) return catalogueState.data()?.servicesManaged === true ? [] : trippleSServiceSeed;
    return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<ServiceRecord, "id">) })).filter((item) => item.active);
  } catch (error) {
    console.warn("[Tripple S] public services unavailable; using the seed catalogue", error);
    return trippleSServiceSeed;
  }
}
export async function saveServiceRecord(item: ServiceRecord) { await setDoc(doc(db, "services", item.id), item); await setDoc(doc(db, "settings", "catalogueState"), { servicesManaged: true }, { merge: true }); }
export async function deleteServiceRecord(id: string) { await deleteDoc(doc(db, "services", id)); await setDoc(doc(db, "settings", "catalogueState"), { servicesManaged: true }, { merge: true }); }

export async function getPublicProducts(): Promise<ProductRecord[]> {
  try {
    const [snapshot, catalogueState] = await Promise.all([
      getDocs(query(productsCollection, where("active", "==", true))),
      getDoc(doc(db, "settings", "catalogueState")),
    ]);
    const records = snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<ProductRecord, "id">) }));
    // Once an owner has managed the catalogue, an empty active query means all products are intentionally hidden.
    return catalogueState.data()?.productsManaged === true ? records : (records.length ? records : trippleSProductSeed);
  } catch (error) {
    console.warn("[Tripple S] public products unavailable; using the seed catalogue", error);
    return trippleSProductSeed;
  }
}

export async function getProducts(): Promise<ProductRecord[]> {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<ProductRecord, "id">) }));
}
export async function saveProductRecord(item: ProductRecord) { await setDoc(doc(db, "products", item.id), item); await setDoc(doc(db, "settings", "catalogueState"), { productsManaged: true }, { merge: true }); }
export async function deleteProductRecord(id: string) { await deleteDoc(doc(db, "products", id)); await setDoc(doc(db, "settings", "catalogueState"), { productsManaged: true }, { merge: true }); }

export async function createBookingRequest(data: Omit<BookingRequestRecord, "id">) {
  const result = await addDoc(bookingCollection, data);
  return result.id;
}
export async function getBookingRequests(): Promise<BookingRequestRecord[]> {
  const snapshot = await getDocs(bookingCollection);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<BookingRequestRecord, "id">) }));
}
export async function updateBookingStatus(id: string, status: BookingStatus) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Please sign in again before changing a request.");
  const response = await fetch("/api/admin/booking-status", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify({ id, status }) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Request status could not be updated.");
}
export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus) { await updateDoc(doc(db, "bookingRequests", id), { paymentStatus }); }


const clinicSettingsRef = doc(db, "settings", "clinic");

export async function getClinicSettings(): Promise<ClinicSettings> {
  try {
    const snapshot = await getDoc(clinicSettingsRef);
    if (!snapshot.exists()) return defaultClinicSettings;
    const saved = snapshot.data() as Partial<ClinicSettings>;
    return {
      openingHours: { ...defaultClinicSettings.openingHours, ...(saved.openingHours ?? {}) },
      bookingRules: { ...defaultClinicSettings.bookingRules, ...(saved.bookingRules ?? {}) },
      announcement: { ...defaultClinicSettings.announcement, ...(saved.announcement ?? {}) },
    };
  } catch (error) {
    console.warn("[Tripple S] clinic settings unavailable; using default hours", error);
    return defaultClinicSettings;
  }
}

export async function saveClinicSettings(settings: ClinicSettings) {
  await setDoc(clinicSettingsRef, settings);
}


export type AppointmentRecord = { id:string; date:string; startTime:string; endTime:string; title:string; kind:"APPOINTMENT"|"BLOCK"; notes?:string };
export type LoyaltyProgramRecord = { id:string; title:string; description:string; discountType:"PERCENT"|"AMOUNT"; value:number; code:string; eligibility:"ALL"|"RETURNING"; active:boolean; startDate?:string; endDate?:string };
const appointmentsCollection=collection(db,"appointments");

export async function getAppointments():Promise<AppointmentRecord[]>{const snap=await getDocs(appointmentsCollection);return snap.docs.map(x=>({id:x.id,...(x.data() as Omit<AppointmentRecord,"id">)}));}
export async function saveAppointmentRecord(item:AppointmentRecord){const token=await auth.currentUser?.getIdToken();if(!token)throw new Error("Please sign in again before changing the calendar.");const response=await fetch("/api/admin/calendar",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify(item)});const result=await response.json();if(!response.ok)throw new Error(result.error||"Calendar entry could not be saved.");}
export async function deleteAppointmentRecord(item:AppointmentRecord){const token=await auth.currentUser?.getIdToken();if(!token)throw new Error("Please sign in again before changing the calendar.");const response=await fetch("/api/admin/calendar",{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify({id:item.id})});const result=await response.json();if(!response.ok)throw new Error(result.error||"Calendar entry could not be removed.");}
export async function getLoyaltyPrograms():Promise<LoyaltyProgramRecord[]>{const token=await auth.currentUser?.getIdToken();if(!token)throw new Error("Please sign in again.");const response=await fetch("/api/admin/loyalty",{headers:{Authorization:"Bearer "+token}});const result=await response.json();if(!response.ok)throw new Error(result.error||"Could not load loyalty programmes.");return result.items as LoyaltyProgramRecord[];}
export async function getPublicLoyaltyPrograms():Promise<LoyaltyProgramRecord[]>{try{const response=await fetch("/api/offers",{cache:"no-store"});if(!response.ok)return [];const result=await response.json();return result.items as LoyaltyProgramRecord[];}catch{return [];}}
export async function saveLoyaltyProgram(item:LoyaltyProgramRecord){const token=await auth.currentUser?.getIdToken();if(!token)throw new Error("Please sign in again.");const response=await fetch("/api/admin/loyalty",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify(item)});const result=await response.json();if(!response.ok)throw new Error(result.error||"Could not save offer.");}
export async function deleteLoyaltyProgram(id:string){const token=await auth.currentUser?.getIdToken();if(!token)throw new Error("Please sign in again.");const response=await fetch("/api/admin/loyalty",{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify({id})});const result=await response.json();if(!response.ok)throw new Error(result.error||"Could not delete offer.");}
