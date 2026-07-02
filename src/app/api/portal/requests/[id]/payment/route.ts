import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { connectDB } from "@/lib/db";
import { deletePrivatePaymentProof, uploadPrivatePaymentProof } from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/utils";
import { Order } from "@/models/Order";

const allowedImages=new Set(["image/jpeg","image/png","image/webp"]);

export async function POST(
  req:NextRequest,
  {params}:{params:Promise<{id:string}>}
){
  const session=await getCustomerSession();
  if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {id}=await params;
  if(!mongoose.isValidObjectId(id)){
    return NextResponse.json({error:"Request not found."},{status:404});
  }
  const ip=req.headers.get("x-forwarded-for")?.split(",")[0]??"unknown";
  if(!rateLimit(`payment-proof:${session.id}:${ip}`,5,30*60_000).allowed){
    return NextResponse.json({error:"Too many payment submissions. Try again later."},{status:429});
  }

  const data=await req.formData().catch(()=>null);
  const proof=data?.get("proof");
  const transactionId=sanitizeText(String(data?.get("transactionId")??"")).trim();
  if(transactionId.length<4||transactionId.length>100){
    return NextResponse.json({error:"Enter a valid transaction ID."},{status:400});
  }
  if(!(proof instanceof File)||!proof.size){
    return NextResponse.json({error:"Attach your payment receipt or screenshot."},{status:400});
  }
  if(proof.size>3*1024*1024){
    return NextResponse.json({error:"Payment proof must be 3 MB or smaller."},{status:413});
  }
  if(!allowedImages.has(proof.type)){
    return NextResponse.json({error:"Upload a JPG, PNG or WebP image."},{status:415});
  }

  await connectDB();
  const order=await Order.findOne({_id:id,customerId:session.id});
  if(!order)return NextResponse.json({error:"Request not found."},{status:404});
  if(order.orderStatus!=="waiting_for_payment"||Number(order.price)<=0){
    return NextResponse.json({error:"This request is not currently awaiting payment."},{status:409});
  }
  if(order.paymentStatus==="paid"){
    return NextResponse.json({error:"Payment is already confirmed."},{status:409});
  }

  try{
    const previousPublicId=String(order.paymentProofPublicId??"");
    const uploaded=await uploadPrivatePaymentProof(proof);
    const submittedAt=new Date();
    order.paymentProofPublicId=uploaded.public_id;
    order.paymentProofFormat=uploaded.format;
    order.paymentScreenshotUrl=undefined;
    order.paymentTransactionId=transactionId;
    order.paymentSubmittedAt=submittedAt;
    order.paymentStatus="pending";
    order.paymentRejectionReason="";
    order.statusHistory.push({
      status:"waiting_for_payment",
      label:"Payment proof submitted for verification",
      at:submittedAt
    });
    await order.save();
    if(previousPublicId&&previousPublicId!==uploaded.public_id){
      try{
        await deletePrivatePaymentProof(previousPublicId);
      }catch(error){
        console.error("Old payment proof cleanup failed:",error);
      }
    }
    return NextResponse.json({
      ok:true,
      paymentStatus:"pending",
      paymentSubmittedAt:submittedAt.toISOString()
    });
  }catch(error){
    console.error("Payment proof upload failed:",error);
    return NextResponse.json({error:"Unable to upload payment proof. Please try again."},{status:502});
  }
}
