import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getCustomerSession } from "@/lib/customer-auth";
import { getCustomerOrders } from "@/lib/portal-orders";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/utils";
import { portalRequestSchema } from "@/lib/validations";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

export async function GET(){
  const session=await getCustomerSession();
  if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  return NextResponse.json(await getCustomerOrders(session.id));
}

export async function POST(req:NextRequest){
  const session=await getCustomerSession();
  if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  const ip=req.headers.get("x-forwarded-for")?.split(",")[0]??"unknown";
  if(!rateLimit(`portal-request:${session.id}:${ip}`,6,30*60_000).allowed){
    return NextResponse.json({error:"Too many requests. Try again later."},{status:429});
  }
  const parsed=portalRequestSchema.safeParse(await req.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:"Please check the required fields."},{status:400});

  await connectDB();
  const user=await User.findOne({_id:session.id,role:"customer",status:"active"}).lean();
  if(!user)return NextResponse.json({error:"Customer account is unavailable."},{status:403});
  const values=Object.fromEntries(Object.entries(parsed.data).map(([key,value])=>[
    key,typeof value==="string"?sanitizeText(value):value
  ]));
  const order=await Order.create({
    ...values,customerId:session.id,studentName:user.name,phone:user.phone,email:user.email,
    paymentStatus:"unpaid",orderStatus:"new",
    statusHistory:[{status:"new",label:"Request submitted",at:new Date()}]
  });
  return NextResponse.json({ok:true,id:String(order._id),reference:String(order._id).slice(-8).toUpperCase()},{status:201});
}
