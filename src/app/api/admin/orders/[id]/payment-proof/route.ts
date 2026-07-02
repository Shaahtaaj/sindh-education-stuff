import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { createPrivateImageUrl } from "@/lib/cloudinary";
import { Order } from "@/models/Order";

export async function GET(
  _req:Request,
  {params}:{params:Promise<{id:string}>}
){
  if(!await getSession())return NextResponse.json({error:"Unauthorized"},{status:401});
  const {id}=await params;
  if(!mongoose.isValidObjectId(id)){
    return NextResponse.json({error:"Payment proof not found."},{status:404});
  }
  await connectDB();
  const order=await Order.findById(id).select("paymentProofPublicId paymentProofFormat paymentScreenshotUrl").lean();
  if(!order)return NextResponse.json({error:"Payment proof not found."},{status:404});
  if(order.paymentProofPublicId){
    return NextResponse.redirect(createPrivateImageUrl(
      String(order.paymentProofPublicId),
      String(order.paymentProofFormat??"")
    ));
  }
  if(order.paymentScreenshotUrl){
    return NextResponse.redirect(String(order.paymentScreenshotUrl));
  }
  return NextResponse.json({error:"Payment proof not found."},{status:404});
}
