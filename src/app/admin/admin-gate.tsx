"use client";

import { onAuthStateChanged, signInWithCustomToken, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/client";
import { setLocalDemoMode } from "@/lib/tripple-s/local-demo";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffSignIn, setStaffSignIn] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { setLocalDemoMode(false); }, []);

  useEffect(() => onAuthStateChanged(auth, async (nextUser) => {
    setUser(nextUser);
    if (!nextUser) { setAuthorized(false); setChecking(false); return; }
    try {
      const role = await getDoc(doc(db, "admins", nextUser.uid));
      const allowed = role.exists() && ["owner", "staff"].includes(String(role.data().role));
      setAuthorized(allowed);
      if (!allowed) await signOut(auth);
    } catch {
      setAuthorized(false);
      await signOut(auth);
    } finally { setChecking(false); }
  }), []);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      if (staffSignIn) {
        const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const role = await getDoc(doc(db, "admins", credential.user.uid));
        if (!role.exists() || !["owner", "staff"].includes(String(role.data().role))) {
          await signOut(auth);
          throw new Error("This account is not enabled for Tripple S Admin.");
        }
      } else {
        const response = await fetch("/api/admin/login", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || typeof result.customToken !== "string") throw new Error(result.error || "Admin sign-in failed. Please try again.");
        const credential = await signInWithCustomToken(auth, result.customToken);
        const role = await getDoc(doc(db, "admins", credential.user.uid));
        if (!role.exists() || String(role.data().role) !== "owner") {
          await signOut(auth);
          throw new Error("The Admin password is not linked to an owner account.");
        }
      }
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not sign you in. Please check your details.");
    } finally { setBusy(false); }
  }

  if (checking) return <main className="adminPage"><div className="adminShell"><div className="emptyState"><h1>Opening Tripple S Admin</h1><p>Checking access…</p></div></div></main>;
  if (user && authorized) return <div className="adminAuthorized"><div className="adminAccountBar"><span>Signed in as {user.email ?? "authorized Tripple S owner/staff"}</span><button className="button buttonLight" onClick={() => void signOut(auth)}>Sign out</button></div>{children}</div>;

  return <main className="adminPage"><div className="adminShell"><section className="adminPanel" style={{ maxWidth: 520, margin: "80px auto" }}>
    <span className="kicker">TRIPPLE S · ADMIN</span><h1>Admin</h1><p>Sign in to start.</p>
    <form className="adminForm" onSubmit={signIn}>
      {staffSignIn && <label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="username" required /></label>}
      <label>{staffSignIn ? "Staff password" : "Admin password"}<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label>
      {error && <p role="alert">{error}</p>}
      <button className="button buttonPrimary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
    <button className="button buttonLight" type="button" onClick={() => { setStaffSignIn(value => !value); setEmail(""); setPassword(""); setError(""); }}>{staffSignIn ? "Use Admin password" : "Staff sign-in"}</button>
  </section></div></main>;
}
