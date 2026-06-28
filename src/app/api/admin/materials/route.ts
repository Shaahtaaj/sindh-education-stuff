import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { readLocalCollection, writeLocalCollection } from "@/lib/local-store";
import { sanitizeText } from "@/lib/utils";

type MaterialRecord = Record<string, unknown> & { id:string; createdAt:string; updatedAt:string };
const storeName="admin-materials";

function cleanRecord(body:Record<string,unknown>) {
  return Object.fromEntries(Object.entries(body).map(([key,value])=>[
    key,
    typeof value==="string"?sanitizeText(value):value
  ]));
}
async function collection(){await connectDB();return mongoose.connection.db!.collection<MaterialRecord>("admin_materials")}
async function authorized(){return Boolean(await getSession())}

export async function GET(){
  if(!await authorized())return NextResponse.json({error:"Unauthorized"},{status:401});
  try{return NextResponse.json((await (await collection()).find({}).sort({createdAt:-1}).limit(500).toArray()).map(row=>({...row,_id:undefined})))}
  catch{if(process.env.NODE_ENV==="production")return NextResponse.json({error:"Database is not configured."},{status:503});return NextResponse.json(await readLocalCollection<MaterialRecord>(storeName))}
}
export async function POST(req:NextRequest){
  if(!await authorized())return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=cleanRecord(await req.json().catch(()=>({})));if(!body.title||!body.slug)return NextResponse.json({error:"Title and slug are required."},{status:400});
  const now=new Date().toISOString();const record={...body,id:randomUUID(),createdAt:now,updatedAt:now} as MaterialRecord;
  try{await (await collection()).insertOne(record)}catch{if(process.env.NODE_ENV==="production")return NextResponse.json({error:"Database is not configured."},{status:503});const rows=await readLocalCollection<MaterialRecord>(storeName);rows.unshift(record);await writeLocalCollection(storeName,rows)}
  return NextResponse.json(record,{status:201});
}
export async function PATCH(req:NextRequest){
  if(!await authorized())return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=cleanRecord(await req.json().catch(()=>({})));const id=String(body.id??"");if(!id)return NextResponse.json({error:"Material id is required."},{status:400});
  const record={...body,id,updatedAt:new Date().toISOString()} as MaterialRecord;
  try{await (await collection()).updateOne({id},{$set:record})}catch{if(process.env.NODE_ENV==="production")return NextResponse.json({error:"Database is not configured."},{status:503});const rows=await readLocalCollection<MaterialRecord>(storeName);const index=rows.findIndex(row=>row.id===id);if(index<0)return NextResponse.json({error:"Material not found."},{status:404});rows[index]={...rows[index],...record};await writeLocalCollection(storeName,rows);return NextResponse.json(rows[index])}
  return NextResponse.json(record);
}
export async function DELETE(req:NextRequest){
  if(!await authorized())return NextResponse.json({error:"Unauthorized"},{status:401});
  const id=req.nextUrl.searchParams.get("id");if(!id)return NextResponse.json({error:"Material id is required."},{status:400});
  try{await (await collection()).deleteOne({id})}catch{if(process.env.NODE_ENV==="production")return NextResponse.json({error:"Database is not configured."},{status:503});const rows=await readLocalCollection<MaterialRecord>(storeName);await writeLocalCollection(storeName,rows.filter(row=>row.id!==id))}
  return NextResponse.json({ok:true});
}
