import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { CUSTOMER_COOKIE_NAME, createCustomerToken } from "@/lib/customer-auth";
import { rateLimit } from "@/lib/rate-limit";
import { customerLoginSchema } from "@/lib/validations";
import { User } from "@/models/User";

export async function POST(req:NextRequest){
  const ip=req.headers.get("x-forwarded-for")?.split(",")[0]??"unknown";
  if(!rateLimit(`customer-login:${ip}`,8,15*60_000).allowed){
    return NextResponse.json({error:"Too many login attempts. Try again later."},{status:429});
  }
  const parsed=customerLoginSchema.safeParse(await req.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:"Enter a valid email and password."},{status:400});

  try{
    await connectDB();
    const user=await User.findOne({email:parsed.data.email.toLowerCase(),role:"customer",status:"active"});
    if(!user||!await bcrypt.compare(parsed.data.password,user.passwordHash)){
      return NextResponse.json({error:"Invalid email or password."},{status:401});
    }
    const token=createCustomerToken({id:String(user._id),email:user.email,name:user.name,role:"customer"});
    const response=NextResponse.json({ok:true,user:{name:user.name,email:user.email}});
    response.cookies.set(CUSTOMER_COOKIE_NAME,token,{
      httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*24*7
    });
    return response;
  }catch{
    return NextResponse.json({error:"Login service is temporarily unavailable."},{status:503});
  }
}
