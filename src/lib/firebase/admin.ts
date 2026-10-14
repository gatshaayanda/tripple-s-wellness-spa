import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

type ServiceAccount = { project_id: string; client_email: string; private_key: string };

function getAdminApp() {
  const existing = getApps().find((item) => item.name === "tripple-s-server");
  if (existing) return existing;

  let account: ServiceAccount;
  const raw = process.env.FIREBASE_ADMIN_KEY?.trim();

  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      account = (typeof parsed === "string" ? JSON.parse(parsed) : parsed) as ServiceAccount;
    } catch {
      throw new Error("FIREBASE_ADMIN_KEY must contain valid service-account JSON.");
    }
  } else {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Firebase Admin credentials are not configured. Set FIREBASE_ADMIN_KEY or all three split credential variables.");
    }
    account = { project_id: projectId, client_email: clientEmail, private_key: privateKey };
  }

  if (!account?.project_id || !account.client_email || !account.private_key) {
    throw new Error("Firebase Admin credentials are missing project_id, client_email or private_key.");
  }

  const expectedProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (expectedProjectId && account.project_id !== expectedProjectId) {
    throw new Error("Firebase Admin service account project does not match NEXT_PUBLIC_FIREBASE_PROJECT_ID.");
  }

  const privateKey = account.private_key.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
  return initializeApp({
    credential: cert({
      projectId: account.project_id,
      clientEmail: account.client_email,
      privateKey,
    }),
    projectId: account.project_id,
  }, "tripple-s-server");
}

export function getAdminDb() { return getFirestore(getAdminApp()); }

export async function requireAdmin(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return null;
  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(header.slice(7));
    const role = await getAdminDb().collection("admins").doc(decoded.uid).get();
    if (!role.exists || !["owner", "staff"].includes(String(role.data()?.role))) return null;
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}
