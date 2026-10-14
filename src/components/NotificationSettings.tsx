"use client";
import { useCallback, useEffect, useState } from "react";
import { getIdToken, onAuthStateChanged, type User } from "firebase/auth";
import { getToken } from "firebase/messaging";
import { auth } from "@/lib/firebase/client";
import { getMessagingInstance } from "@/lib/firebase/notifications";
const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";
type Preferences = { enabled:boolean; appointmentUpdates:boolean; offersAndNews:boolean; updatedAt:string };
const defaults: Preferences = { enabled:false, appointmentUpdates:true, offersAndNews:false, updatedAt:"" };
export default function NotificationSettings() {
 const [uid,setUid]=useState(""); const [prefs,setPrefs]=useState<Preferences>(defaults);
 const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [permission,setPermission]=useState<NotificationPermission|"unsupported">("default"); const [registered,setRegistered]=useState(false);
 const load=useCallback(async(user:User)=>{
  const response=await fetch("/api/customer/notifications",{cache:"no-store",headers:{Authorization:"Bearer "+await getIdToken(user)}});
  const result=await response.json() as {preferences?:Preferences;registered?:boolean;error?:string};
  if(!response.ok)throw new Error(result.error||"Notification preferences could not be loaded.");
  setPrefs({...defaults,...result.preferences});setRegistered(result.registered===true);
 },[]);
 useEffect(()=>{
  setPermission(typeof window!=="undefined"&&"Notification" in window?Notification.permission:"unsupported");
  return onAuthStateChanged(auth,async user=>{
   if(!user){setUid("");setRegistered(false);return;}setUid(user.uid);
   try{await load(user);}catch(error){setMessage(error instanceof Error?error.message:"Notification preferences could not be loaded.");}
  });
 },[load]);
 async function savePreferences(next:Preferences) {
  const user=auth.currentUser;if(!user)return;setBusy(true);setMessage("");
  try{
   const response=await fetch("/api/customer/notifications",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+await getIdToken(user,true)},body:JSON.stringify({appointmentUpdates:next.appointmentUpdates,offersAndNews:next.offersAndNews})});
   const result=await response.json() as {preferences?:Preferences;error?:string};if(!response.ok)throw new Error(result.error||"Preferences could not be saved.");
   setPrefs({...defaults,...result.preferences});setMessage("Your preferences are saved. Appointment status remains available in My Tripple S.");
  }catch(error){setMessage(error instanceof Error?error.message:"Preferences could not be saved. Check your connection and try again.");}finally{setBusy(false);}
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
   const deviceToken=await getToken(messaging,{vapidKey,serviceWorkerRegistration:registration});if(!deviceToken)throw new Error("This device could not be registered for Tripple S notifications.");
   const response=await fetch("/api/customer/notifications",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+await getIdToken(user,true)},body:JSON.stringify({enabled:true,appointmentUpdates:prefs.appointmentUpdates,offersAndNews:prefs.offersAndNews,deviceToken})});
   const result=await response.json() as {preferences?:Preferences;registered?:boolean;error?:string};if(!response.ok)throw new Error(result.error||"This device could not be registered.");
   setPrefs({...defaults,...result.preferences});setRegistered(result.registered===true);
   setMessage("This device is registered. Browser/device settings still control whether a system notification appears.");
  }catch(error){setMessage(error instanceof Error?error.message:"Notifications could not be enabled.");}finally{setBusy(false);}
 }
 async function test() {
  const user=auth.currentUser;if(!user)return;
  if(!vapidKey){setMessage("Push is not configured on this deployment yet.");return;}
  setBusy(true);setMessage("");
  try{
   if(!("Notification" in window)||Notification.permission!=="granted")throw new Error("Enable notifications on this device first.");
   const messaging=await getMessagingInstance(),registration=await navigator.serviceWorker.ready;
   const deviceToken=await getToken(messaging,{vapidKey,serviceWorkerRegistration:registration});
   if(!deviceToken)throw new Error("This device is not registered for Tripple S notifications yet.");
   const response=await fetch("/api/notifications/test",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+await getIdToken(user,true)},body:JSON.stringify({deviceToken})});
   const result=await response.json() as {error?:string;sent?:boolean};
   if(!response.ok||!result.sent)throw new Error(result.error||"The test notification could not be sent.");
   setMessage("The push service accepted the test for this device. Check the notification shade; this response does not guarantee OS display.");
  }catch(error){setMessage(error instanceof Error?error.message:"The test notification failed.");}finally{setBusy(false);}
 }
 return <section className="notificationSettings">
  <div className="panelHeading"><div><span className="kicker">YOUR PREFERENCES</span><h2>Notifications</h2></div><span className="orderTruth">{registered&&prefs.enabled?"Push is enabled on this account":permission==="denied"?"Blocked by browser/device":"Optional"}</span></div>
  <p>Choose useful updates after your request is saved. You can always check request status here, even when push notifications are unavailable.</p>
  <label className="notificationPreference"><input type="checkbox" checked={prefs.appointmentUpdates} disabled={busy||!uid} onChange={event=>void savePreferences({...prefs,appointmentUpdates:event.target.checked})}/><span><strong>Appointment updates</strong><small>Let this device receive supported changes to your request status.</small></span></label>
  <label className="notificationPreference"><input type="checkbox" checked={prefs.offersAndNews} disabled={busy||!uid} onChange={event=>void savePreferences({...prefs,offersAndNews:event.target.checked})}/><span><strong>Published offers & clinic news</strong><small>Optional updates only when the clinic publishes relevant information.</small></span></label>
  {!vapidKey?<p className="notificationSetupNote">Push setup is not complete on this deployment. These preferences can be saved, but system notifications will not be sent until the clinic&apos;s Firebase Web Push key is configured.</p>:<div className="actions"><button type="button" className="button buttonPrimary" disabled={busy||!uid} onClick={()=>void enable()}>{busy?"Setting up…":"Enable notifications on this device"}</button><button type="button" className="button buttonLight" disabled={busy||!uid} onClick={()=>void test()}>{busy?"Checking…":"Send a test to this device"}</button></div>}
  {message&&<p className="notice" role="status">{message}</p>}
 </section>;
}
