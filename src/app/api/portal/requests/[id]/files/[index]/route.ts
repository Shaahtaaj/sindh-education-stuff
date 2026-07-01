import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { createPrivateDownloadUrl } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { getCustomerSession } from "@/lib/customer-auth";
import { Order } from "@/models/Order";

export async function GET(_req:Request,{params}:{params:Promise<{id:string;index:string}>}){
  const session=await getCustomerSession();
  if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {id,index}=await params;const fileIndex=Number(index);
  if(!mongoose.isValidObjectId(id)||!Number.isInteger(fileIndex)||fileIndex<0)return NextResponse.json({error:"Invalid file."},{status:400});
  await connectDB();
  const order=await Order.findOne({_id:id,customerId:session.id}).select("deliveryFiles").lean();
  const files=order?.deliveryFiles as unknown as Array<{publicId?:string;format?:string;url?:string}>|undefined;
  const file=files?.[fileIndex];if(!file)return NextResponse.json({error:"File not found."},{status:404});
  if(file.publicId)return NextResponse.redirect(createPrivateDownloadUrl(file.publicId,file.format??""));
  return file.url?NextResponse.redirect(file.url):NextResponse.json({error:"File unavailable."},{status:404});
}
