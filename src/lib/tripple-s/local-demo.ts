"use client";

const RECORDS_KEY = "tripple-s-local-demo-records-v1";
const MODE_KEY = "tripple-s-local-demo-mode-v1";

export type LocalDemoRecord = {
  id: string;
  createdAt: string;
  requestType?: "APPOINTMENT" | "PRODUCT_ENQUIRY" | "TREATMENT_ENQUIRY" | "GENERAL_ENQUIRY";
  name: string;
  phone: string;
  email?: string;
  serviceId?: string;
  serviceNameSnapshot: string;
  productId?: string;
  productNameSnapshot?: string;
  priceSnapshot?: string;
  durationSnapshot?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  clientType: "NEW" | "RETURNING";
  status: string;
  paymentStatus: string;
  [key: string]: unknown;
};

export function isLocalDemoMode(): boolean {
  return typeof window !== "undefined" && window.localStorage.getItem(MODE_KEY) === "true";
}

export function setLocalDemoMode(enabled: boolean): void {
  if (typeof window === "undefined") return;
  if (enabled) window.localStorage.setItem(MODE_KEY, "true");
  else window.localStorage.removeItem(MODE_KEY);
}

export function getLocalDemoRecords<T extends { id: string } = LocalDemoRecord>(): T[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(RECORDS_KEY) || "[]");
    return Array.isArray(value) ? value as T[] : [];
  } catch {
    return [];
  }
}

export function saveLocalDemoRecord<T extends { id: string }>(record: T): void {
  if (typeof window === "undefined") throw new Error("Local demo storage is only available in this browser.");
  const records = getLocalDemoRecords<T>();
  const next = records.filter(item => item.id !== record.id);
  next.unshift(record);
  window.localStorage.setItem(RECORDS_KEY, JSON.stringify(next.slice(0, 500)));
}

export function updateLocalDemoRecord<T extends { id: string }>(id: string, update: Partial<T>): void {
  const records = getLocalDemoRecords<T>();
  const current = records.find(item => item.id === id);
  if (current) saveLocalDemoRecord({ ...current, ...update });
}

export function deleteLocalDemoRecord(id: string): void {
  if (typeof window === "undefined") return;
  const records = getLocalDemoRecords();
  window.localStorage.setItem(RECORDS_KEY, JSON.stringify(records.filter(item => item.id !== id)));
}

export function makeLocalDemoId(): string {
  return "demo-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

export function getLocalDemoBucket<T extends { id: string }>(bucket: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem("tripple-s-local-demo-bucket-" + bucket) || "[]");
    return Array.isArray(value) ? value as T[] : [];
  } catch {
    return [];
  }
}

export function saveLocalDemoBucketRecord<T extends { id: string }>(bucket: string, record: T): void {
  if (typeof window === "undefined") throw new Error("Local demo storage is only available in this browser.");
  const records = getLocalDemoBucket<T>(bucket).filter(item => item.id !== record.id);
  records.unshift(record);
  window.localStorage.setItem("tripple-s-local-demo-bucket-" + bucket, JSON.stringify(records.slice(0, 500)));
}

export function deleteLocalDemoBucketRecord(bucket: string, id: string): void {
  if (typeof window === "undefined") return;
  const records = getLocalDemoBucket(bucket).filter(item => item.id !== id);
  window.localStorage.setItem("tripple-s-local-demo-bucket-" + bucket, JSON.stringify(records));
}
