import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { readLocalCollection, writeLocalCollection } from "@/lib/local-store";
import { sanitizeText } from "@/lib/utils";

const allowed = new Set([
  "programs","courses","semesters","blog-posts","assignment-dates","faqs","testimonials",
  "website-settings","seo-settings","adsense-settings"
]);
const recordSchema = z.object({
  id: z.string().optional(),
  values: z.array(z.union([z.string(), z.number()])).min(1).max(20)
});

type StoredRecord = { id: string; values: (string | number)[]; createdAt: string; updatedAt: string };

async function context(req: NextRequest, params: Promise<{collection:string}>) {
  const session = await getSession();
  if (!session) return { response: NextResponse.json({error:"Unauthorized"},{status:401}) };
  const {collection} = await params;
  if (!allowed.has(collection)) return { response: NextResponse.json({error:"Unknown collection"},{status:404}) };
  return { collection, session };
}

async function mongoCollection(name:string) {
  await connectDB();
  return mongoose.connection.db!.collection<StoredRecord>(`admin_${name.replace(/-/g,"_")}`);
}

export async function GET(req:NextRequest,{params}:{params:Promise<{collection:string}>}) {
  const ctx=await context(req,params); if("response" in ctx)return ctx.response;
  try {
    const rows=await (await mongoCollection(ctx.collection)).find({}).sort({createdAt:-1}).limit(500).toArray();
    return NextResponse.json(rows.map(row=>({...row,_id:undefined})));
  } catch {
    if(process.env.NODE_ENV==="production")return NextResponse.json({error:"Database is not configured."},{status:503});
    return NextResponse.json(await readLocalCollection<StoredRecord>(`admin-${ctx.collection}`));
  }
}

export async function POST(req:NextRequest,{params}:{params:Promise<{collection:string}>}) {
  const ctx=await context(req,params); if("response" in ctx)return ctx.response;
  const parsed=recordSchema.safeParse(await req.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:"Invalid record."},{status:400});
  const now=new Date().toISOString();
  const record:StoredRecord={id:randomUUID(),values:parsed.data.values.map(value=>typeof value==="string"?sanitizeText(value):value),createdAt:now,updatedAt:now};
  try { await (await mongoCollection(ctx.collection)).insertOne(record); }
  catch {
    if(process.env.NODE_ENV==="production")return NextResponse.json({error:"Database is not configured."},{status:503});
    const rows=await readLocalCollection<StoredRecord>(`admin-${ctx.collection}`);rows.unshift(record);await writeLocalCollection(`admin-${ctx.collection}`,rows);
  }
  return NextResponse.json(record,{status:201});
}

export async function PATCH(req:NextRequest,{params}:{params:Promise<{collection:string}>}) {
  const ctx=await context(req,params); if("response" in ctx)return ctx.response;
  const parsed=recordSchema.extend({id:z.string().min(1)}).safeParse(await req.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:"Invalid record."},{status:400});
  const values=parsed.data.values.map(value=>typeof value==="string"?sanitizeText(value):value);
  const updatedAt=new Date().toISOString();
  try { await (await mongoCollection(ctx.collection)).updateOne({id:parsed.data.id},{$set:{values,updatedAt}}); }
  catch {
    if(process.env.NODE_ENV==="production")return NextResponse.json({error:"Database is not configured."},{status:503});
    const rows=await readLocalCollection<StoredRecord>(`admin-${ctx.collection}`);const index=rows.findIndex(row=>row.id===parsed.data.id);if(index<0)return NextResponse.json({error:"Record not found."},{status:404});rows[index]={...rows[index],values,updatedAt};await writeLocalCollection(`admin-${ctx.collection}`,rows);
  }
  return NextResponse.json({id:parsed.data.id,values,updatedAt});
}

export async function DELETE(req:NextRequest,{params}:{params:Promise<{collection:string}>}) {
  const ctx=await context(req,params); if("response" in ctx)return ctx.response;
  const id=req.nextUrl.searchParams.get("id");if(!id)return NextResponse.json({error:"Missing record id."},{status:400});
  try { await (await mongoCollection(ctx.collection)).deleteOne({id}); }
  catch {
    if(process.env.NODE_ENV==="production")return NextResponse.json({error:"Database is not configured."},{status:503});
    const rows=await readLocalCollection<StoredRecord>(`admin-${ctx.collection}`);await writeLocalCollection(`admin-${ctx.collection}`,rows.filter(row=>row.id!==id));
  }
  return NextResponse.json({ok:true});
}
