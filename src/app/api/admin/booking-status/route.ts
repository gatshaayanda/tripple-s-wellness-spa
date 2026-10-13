import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, requireAdmin } from "@/lib/firebase/admin";
const allowed = new Set(["NEW","REVIEWING","APPROVED","PAYMENT_PENDING","CONFIRMED","ARRIVED","COMPLETED","NEEDS_CONTACT","DECLINED","RESCHEDULED","CANCELLED","NO_SHOW","FOLLOW_UP"]);
export async function POST(request:NextRequest){
 if(!await requireAdmin(request))return NextResponse.json({error:"Sign in with an authorized staff account."},{status:401});
 let body:Record<string,unknown>;try{body=await request.json() as Record<string,unknown>;}catch{return NextResponse.json({error:"Invalid request status."},{status:400});}
 const id=String(body.id||""),status=String(body.status||"");
 if(!id||!allowed.has(status))return NextResponse.json({error:"Choose a valid request status."},{status:400});
 try{
  const db=getAdminDb(),ref=db.collection("bookingRequests").doc(id);
  await db.runTransaction(async tx=>{
   const requestSnap=await tx.get(ref);if(!requestSnap.exists)throw new Error("REQUEST_NOT_FOUND");
   const held= status==="DECLINED"||status==="CANCELLED"||status==="RESCHEDULED" ? await tx.get(db.collection("slotReservations").where("bookingRequestId","==",id)) : null;
   tx.update(ref,{status});
   if(held)held.docs.forEach(item=>tx.delete(item.ref));
  });
  return NextResponse.json({ok:true});
 }catch(error){const message=error instanceof Error?error.message:"";return NextResponse.json({error:message==="REQUEST_NOT_FOUND"?"That booking request no longer exists.":"Request status could not be updated."},{status:message==="REQUEST_NOT_FOUND"?404:500});}
}
