import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
function getAdminApp() {
  const raw = process.env.FIREBASE_ADMIN_KEY;
  if (!raw) throw new Error("FIREBASE_ADMIN_KEY is not configured.");
  const account = JSON.parse(raw) as { project_id: string; client_email: string; private_key: string };
  return getApps().find((item) => item.name === "tripple-s-server") ?? initializeApp({
    credential: cert({ projectId: account.project_id, clientEmail: account.client_email, privateKey: account.private_key.replace(/\\n/g, "\n") }),
    projectId: account.project_id,
  }, "tripple-s-server");
}
export function getAdminDb() { return getFirestore(getAdminApp()); }
export function getAdminMessaging() { return getMessaging(getAdminApp()); }
export async function requireCustomer(request: Request) {
 const header=request.headers.get("authorization")??""; if(!header.startsWith("Bearer "))return null;
 try { const decoded=await getAuth(getAdminApp()).verifyIdToken(header.slice(7)); return {uid:decoded.uid,email:decoded.email??null}; } catch { return null; }
}
export async function requireAdmin(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return null;
  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(header.slice(7));
    const role = await getAdminDb().collection("admins").doc(decoded.uid).get();
    if (!role.exists || !["owner", "staff"].includes(String(role.data()?.role))) return null;
    return { uid: decoded.uid };
  } catch { return null; }
}
