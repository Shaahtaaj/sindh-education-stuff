import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { CUSTOMER_COOKIE_NAME, createCustomerToken } from "@/lib/customer-auth";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/utils";
import { customerRegisterSchema } from "@/lib/validations";
import { User } from "@/models/User";

export async function POST(req:NextRequest){
  const ip=req.headers.get("x-forwarded-for")?.split(",")[0]??"unknown";
  if(!rateLimit(`customer-register:${ip}`,5,15*60_000).allowed){
    return NextResponse.json({error:"Too many registration attempts. Try again later."},{status:429});
  }
  const parsed=customerRegisterSchema.safeParse(await req.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:"Please check your registration details."},{status:400});

  try{
    const email=parsed.data.email.toLowerCase();
    await connectDB();
    if(await User.exists({email}))return NextResponse.json({error:"An account with this email already exists."},{status:409});

    const user=await User.create({
      name:sanitizeText(parsed.data.name),
      email,
      phone:sanitizeText(parsed.data.phone),
      passwordHash:await bcrypt.hash(parsed.data.password,12),
      role:"customer",
      status:"active"
    });
    const token=createCustomerToken({id:String(user._id),email:user.email,name:user.name,role:"customer"});
    const response=NextResponse.json({ok:true,user:{name:user.name,email:user.email}},{status:201});
    response.cookies.set(CUSTOMER_COOKIE_NAME,token,{
      httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*24*7
    });
    return response;
  }catch{
    return NextResponse.json({error:"Account service is temporarily unavailable."},{status:503});
  }
}
