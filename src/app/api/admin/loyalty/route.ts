import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, requireAdmin } from "@/lib/firebase/admin";
export const dynamic = "force-dynamic";
const safeFields = (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
 const d=doc.data();
 return {id:doc.id,title:String(d.title||""),description:String(d.description||""),discountType:d.discountType==="AMOUNT"?"AMOUNT":"PERCENT",value:Number(d.value||0),code:String(d.code||""),eligibility:d.eligibility==="RETURNING"?"RETURNING":"ALL",active:d.active===true,startDate:String(d.startDate||""),endDate:String(d.endDate||"")};
};
export async function GET(request:NextRequest){
 if(!await requireAdmin(request))return NextResponse.json({error:"Sign in with an authorized staff account."},{status:401});
 try{const snap=await getAdminDb().collection("loyaltyPrograms").get();return NextResponse.json({items:snap.docs.map(safeFields)});}
 catch{return NextResponse.json({error:"Loyalty programmes could not be loaded."},{status:500});}
}
export async function POST(request:NextRequest){
 if(!await requireAdmin(request))return NextResponse.json({error:"Sign in with an authorized staff account."},{status:401});
 let body:Record<string,unknown>;try{body=await request.json() as Record<string,unknown>;}catch{return NextResponse.json({error:"Invalid offer."},{status:400});}
 const id=String(body.id||""),title=String(body.title||"").trim().slice(0,120),description=String(body.description||"").trim().slice(0,1000),code=String(body.code||"").trim().toUpperCase().slice(0,40),discountType=body.discountType==="AMOUNT"?"AMOUNT":"PERCENT",value=Number(body.value),eligibility=body.eligibility==="RETURNING"?"RETURNING":"ALL",active=body.active===true,startDate=String(body.startDate||""),endDate=String(body.endDate||"");
 if(!id||!title||!description||!code||!Number.isFinite(value)||value<=0||(discountType==="PERCENT"&&value>100)||(startDate&&endDate&&endDate<startDate))return NextResponse.json({error:"Enter a title, description, code, valid discount and valid dates."},{status:400});
 try{
  const db=getAdminDb(),all=await db.collection("loyaltyPrograms").get();
  const duplicate=all.docs.some(d=>d.id!==id&&String(d.data().code||"").toUpperCase()===code);
  if(duplicate)return NextResponse.json({error:"That offer code is already in use."},{status:409});
  await db.collection("loyaltyPrograms").doc(id).set({title,description,code,discountType,value,eligibility,active,startDate,endDate,updatedAt:new Date().toISOString()},{merge:true});
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:"Offer could not be saved."},{status:500});}
}
export async function DELETE(request:NextRequest){
 if(!await requireAdmin(request))return NextResponse.json({error:"Sign in with an authorized staff account."},{status:401});
 let body:Record<string,unknown>;try{body=await request.json() as Record<string,unknown>;}catch{return NextResponse.json({error:"Invalid deletion request."},{status:400});}
 const id=String(body.id||"");if(!id)return NextResponse.json({error:"Offer ID is required."},{status:400});
 try{await getAdminDb().collection("loyaltyPrograms").doc(id).delete();return NextResponse.json({ok:true});}
 catch{return NextResponse.json({error:"Offer could not be deleted."},{status:500});}
}
