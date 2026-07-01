import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET(){
  const session=await getSession();
  if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  await connectDB();
  const rows=await User.find({role:"customer"}).select("name email phone status createdAt updatedAt").sort({createdAt:-1}).limit(500).lean();
  return NextResponse.json(rows);
}

const updateSchema=z.object({id:z.string().min(1),status:z.enum(["active","inactive"])});

export async function PATCH(req:NextRequest){
  const session=await getSession();
  if(!session||session.role==="order_manager")return NextResponse.json({error:"Forbidden"},{status:403});
  const parsed=updateSchema.safeParse(await req.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:"Invalid customer update."},{status:400});
  await connectDB();
  const updated=await User.findOneAndUpdate(
    {_id:parsed.data.id,role:"customer"},{$set:{status:parsed.data.status}},
    {new:true,runValidators:true}
  ).select("name email phone status createdAt updatedAt").lean();
  return updated?NextResponse.json(updated):NextResponse.json({error:"Customer not found."},{status:404});
}
