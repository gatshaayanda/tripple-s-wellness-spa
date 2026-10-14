"use client";
import { useEffect, useState } from "react";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { getToken } from "firebase/messaging";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { getMessagingInstance } from "@/lib/firebase/notifications";
const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";
type Preferences = { enabled:boolean; appointmentUpdates:boolean; offersAndNews:boolean; updatedAt:string };
async function tokenDocumentId(token:string) {
 const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));
 return Array.from(new Uint8Array(digest),(value)=>value.toString(16).padStart(2,"0")).join("");
}
export default function NotificationSettings() {
 const [uid,setUid]=useState(""); const [prefs,setPrefs]=useState<Preferences>({enabled:false,appointmentUpdates:true,offersAndNews:false,updatedAt:""});
 const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [permission,setPermission]=useState<NotificationPermission|"unsupported">("default"); const [registered,setRegistered]=useState(false);
 useEffect(()=>{
  setPermission(typeof window!=="undefined"&&"Notification" in window?Notification.permission:"unsupported");
  return onAuthStateChanged(auth,async user=>{
   if(!user){setUid("");return;} setUid(user.uid);
   try{const snapshot=await getDoc(doc(db,"notificationPreferences",user.uid));if(snapshot.exists())setPrefs({enabled:false,appointmentUpdates:true,offersAndNews:false,...snapshot.data()} as Preferences);}
   catch{setMessage("Notification preferences could not be loaded on this device.");}
  });
 },[]);
 async function savePreferences(next:Preferences) {
  if(!uid)return;setBusy(true);setMessage("");
  try{const updatedAt=new Date().toISOString();await setDoc(doc(db,"notificationPreferences",uid),{...next,updatedAt},{merge:true});setPrefs({...next,updatedAt});setMessage("Your preferences are saved. Appointment status remains available in My Tripple S.");}
  catch{setMessage("Preferences could not be saved. Check your connection and try again.");}finally{setBusy(false);}
 }
 async function enable() {
  const user=auth.currentUser;if(!user||!uid)return;
  if(!vapidKey){setMessage("Push is not configured on this deployment yet. You can still view appointment updates here; no notification permission was requested.");return;}
  if(!("Notification" in window)||!("serviceWorker" in navigator)){setMessage("This browser does not support web push. Your appointment history will still be available here.");return;}
  setBusy(true);setMessage("");
  try{
   const granted=Notification.permission==="granted"?"granted":await Notification.requestPermission();setPermission(granted);
   if(granted!=="granted")throw new Error(granted==="denied"?"Notifications are blocked for this site in browser/device settings. You can change that later.":"Notifications were not enabled. You can continue using My Tripple S.");
   const messaging=await getMessagingInstance(),registration=await navigator.serviceWorker.ready;
   const token=await getToken(messaging,{vapidKey,serviceWorkerRegistration:registration});if(!token)throw new Error("This device could not be registered for Tripple S notifications.");
   const id=await tokenDocumentId(token);await setDoc(doc(db,"notificationTokens",uid,"devices",id),{token,updatedAt:new Date().toISOString()});
   const next={...prefs,enabled:true,appointmentUpdates:prefs.appointmentUpdates!==false,updatedAt:new Date().toISOString()};
   await setDoc(doc(db,"notificationPreferences",uid),next,{merge:true});setPrefs(next);setRegistered(true);
   setMessage("This device is registered. Browser/device settings still control whether a system notification appears.");
  }catch(error){setMessage(error instanceof Error?error.message:"Notifications could not be enabled.");}finally{setBusy(false);}
 }
 async function test() {
  const user=auth.currentUser;if(!user)return;setBusy(true);setMessage("");
  try{const response=await fetch("/api/notifications/test",{method:"POST",headers:{Authorization:"Bearer "+await getIdToken(user,true)}});const result=await response.json() as {error?:string;sent?:boolean};
   if(!response.ok||!result.sent)throw new Error(result.error||"The test notification could not be sent.");
   setMessage("The push service accepted the test. Check this device's notification shade; that response does not guarantee the operating system displayed it.");
  }catch(error){setMessage(error instanceof Error?error.message:"The test notification failed.");}finally{setBusy(false);}
 }
 return <section className="notificationSettings">
  <div className="panelHeading"><div><span className="kicker">YOUR PREFERENCES</span><h2>Notifications</h2></div><span className="orderTruth">{registered&&prefs.enabled?"This device is registered":permission==="denied"?"Blocked by browser/device":"Optional"}</span></div>
  <p>Choose useful updates after your request is saved. You can always check request status here, even when push notifications are unavailable.</p>
  <label className="notificationPreference"><input type="checkbox" checked={prefs.appointmentUpdates} disabled={busy||!uid} onChange={event=>void savePreferences({...prefs,appointmentUpdates:event.target.checked})}/><span><strong>Appointment updates</strong><small>Let this device receive supported changes to your request status.</small></span></label>
  <label className="notificationPreference"><input type="checkbox" checked={prefs.offersAndNews} disabled={busy||!uid} onChange={event=>void savePreferences({...prefs,offersAndNews:event.target.checked})}/><span><strong>Published offers & clinic news</strong><small>Optional updates only when the clinic publishes relevant information.</small></span></label>
  {!vapidKey?<p className="notificationSetupNote">Push setup is not complete on this deployment. These preferences can be saved, but no system notifications will be sent until the clinic's Firebase Web Push key is configured.</p>:!registered||!prefs.enabled?<button type="button" className="button buttonPrimary" disabled={busy||!uid} onClick={()=>void enable()}>{busy?"Setting up…":permission==="denied"?"Check browser permission":"Enable notifications on this device"}</button>:<button type="button" className="button buttonLight" disabled={busy} onClick={()=>void test()}>{busy?"Sending test…":"Send a test notification"}</button>}
  {message&&<p className="notice" role="status">{message}</p>}
 </section>;
}
