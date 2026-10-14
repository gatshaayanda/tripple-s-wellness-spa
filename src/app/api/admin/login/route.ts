import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

function matchesPassword(supplied: string, expected: string) {
  const suppliedHash = createHash("sha256").update(supplied).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(suppliedHash, expectedHash);
}

export async function POST(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ error: "Admin sign-in is not configured on the server." }, { status: 503 });

  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return NextResponse.json({ error: "Enter the Admin password." }, { status: 400 }); }

  const supplied = typeof body.password === "string" ? body.password : "";
  if (!supplied || supplied.length > 1024 || !matchesPassword(supplied, expected)) {
    return NextResponse.json({ error: "The Admin password is incorrect." }, { status: 401 });
  }

  try {
    const owners = await getAdminDb().collection("admins").where("role", "==", "owner").limit(1).get();
    if (owners.empty) return NextResponse.json({ error: "No owner account is provisioned for Tripple S Admin." }, { status: 503 });
    const customToken = await getAdminAuth().createCustomToken(owners.docs[0].id, { trippleSAdminPassword: true });
    return NextResponse.json({ customToken }, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[Tripple S] Admin password sign-in failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Admin sign-in could not reach the clinic service. Check server configuration and try again." }, { status: 503 });
  }
}
