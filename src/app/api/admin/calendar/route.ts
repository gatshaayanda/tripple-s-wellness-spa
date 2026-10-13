import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, requireAdmin } from "@/lib/firebase/admin";
export const dynamic = "force-dynamic";
const slotId=(date:string,time:string)=>date.replace(/-/g,"")+"_"+time.replace(":","");
const minutes=(time:string)=>Number(time.slice(0,2))*60+Number(time.slice(3,5));
const clock=(minute:number)=>String(Math.floor(minute/60)).padStart(2,"0")+":"+String(minute%60).padStart(2,"0");
export async function POST(request:NextRequest){
 const admin=await requireAdmin(request);if(!admin)return NextResponse.json({error:"Sign in with an authorized staff account."},{status:401});
 let body:Record<string,unknown>;try{body=await request.json() as Record<string,unknown>;}catch{return NextResponse.json({error:"Invalid calendar entry."},{status:400});}
 const item={id:String(body.id||""),date:String(body.date||""),startTime:String(body.startTime||""),endTime:String(body.endTime||""),title:String(body.title||"").trim().slice(0,120),kind:body.kind==="BLOCK"?"BLOCK":body.kind==="WALK_IN"?"WALK_IN":"APPOINTMENT",notes:String(body.notes||"").slice(0,500)};
 if(!item.id||!/^\d{4}-\d{2}-\d{2}$/.test(item.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(item.startTime)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(item.endTime)||item.endTime<=item.startTime||!item.title)return NextResponse.json({error:"Add a label, date and valid start/end times."},{status:400});
 try{
  const db=getAdminDb(),ref=db.collection("appointments").doc(item.id);
  const oldSnap=await ref.get(),old=oldSnap.exists?oldSnap.data():null;
  const oldDate=old?.date,oldStart=old?.startTime,oldEnd=old?.endTime;
  const oldTimes:string[]=oldDate&&oldStart&&oldEnd?Array.from({length:Math.ceil((minutes(oldEnd)-minutes(oldStart))/15)},(_,i)=>clock(minutes(oldStart)+i*15)):[];
  const newTimes:string[]=Array.from({length:Math.ceil((minutes(item.endTime)-minutes(item.startTime))/15)},(_,i)=>clock(minutes(item.startTime)+i*15));
  if(minutes(item.startTime)%15!==0||minutes(item.endTime)%15!==0)return NextResponse.json({error:"Use 15-minute increments for calendar entries."},{status:400});
  const oldRefs=oldDate?oldTimes.map(time=>db.collection("slotReservations").doc(slotId(oldDate,time))):[];
  const newRefs=newTimes.map(time=>db.collection("slotReservations").doc(slotId(item.date,time)));
  await db.runTransaction(async tx=>{
   const unique=Array.from(new Map([...oldRefs,...newRefs].map(r=>[r.path,r])).values());
   const snaps=await Promise.all(unique.map(r=>tx.get(r)));
   const map=new Map(snaps.map(s=>[s.ref.path,s]));
   for(const r of newRefs){const snap=map.get(r.path);if(snap?.exists&&snap.data()?.appointmentId!==item.id)throw new Error("SLOT_TAKEN");}
   for(const r of oldRefs){const snap=map.get(r.path);if(snap?.exists&&snap.data()?.appointmentId===item.id)tx.delete(r);}
   for(let i=0;i<newRefs.length;i++)tx.set(newRefs[i],{date:item.date,time:newTimes[i],appointmentId:item.id,kind:"admin-appointment"});
   tx.set(ref,{...item,updatedAt:new Date().toISOString()});
  });
  return NextResponse.json({ok:true});
 }catch(error){const message=error instanceof Error?error.message:"";return NextResponse.json({error:message==="SLOT_TAKEN"?"That time overlaps another request, appointment or blocked period.":"Calendar entry could not be saved."},{status:message==="SLOT_TAKEN"?409:500});}
}
export async function DELETE(request:NextRequest){
 const admin=await requireAdmin(request);if(!admin)return NextResponse.json({error:"Sign in with an authorized staff account."},{status:401});
 let body:Record<string,unknown>;try{body=await request.json() as Record<string,unknown>;}catch{return NextResponse.json({error:"Invalid removal request."},{status:400});}
 try{
  const db=getAdminDb();
  if(body.bookingRequestId){const snap=await db.collection("slotReservations").where("bookingRequestId","==",String(body.bookingRequestId)).get();const batch=db.batch();snap.docs.forEach(item=>batch.delete(item.ref));await batch.commit();return NextResponse.json({ok:true});}
  const id=String(body.id||"");if(!id)return NextResponse.json({error:"Calendar entry ID is required."},{status:400});
  const ref=db.collection("appointments").doc(id),snap=await ref.get();if(!snap.exists)return NextResponse.json({ok:true});
  const item=snap.data()!,times=Array.from({length:Math.ceil((minutes(item.endTime)-minutes(item.startTime))/15)},(_,i)=>clock(minutes(item.startTime)+i*15));
  const batch=db.batch();for(const time of times){const slot=db.collection("slotReservations").doc(slotId(item.date,time));const slotSnap=await slot.get();if(slotSnap.exists&&slotSnap.data()?.appointmentId===id)batch.delete(slot);}
  batch.delete(ref);await batch.commit();return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:"Calendar entry could not be removed."},{status:500});}
}
