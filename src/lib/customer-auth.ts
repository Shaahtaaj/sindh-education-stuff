import "server-only";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const CUSTOMER_COOKIE_NAME = "customer_session";

export type CustomerSession = {
  id: string;
  email: string;
  name: string;
  role: "customer";
};

export function createCustomerToken(session: CustomerSession) {
  return jwt.sign(session, process.env.JWT_SECRET as string, { expiresIn: "7d" });
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const token=(await cookies()).get(CUSTOMER_COOKIE_NAME)?.value;
  if(!token)return null;
  try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET as string) as CustomerSession;
    if(decoded.role!=="customer"||!decoded.id)return null;
    await connectDB();
    const active=await User.exists({_id:decoded.id,role:"customer",status:"active"});
    return active?decoded:null;
  }catch{
    return null;
  }
}
