import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { getCustomerOrder } from "@/lib/portal-orders";

export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
  const session=await getCustomerSession();
  if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {id}=await params;
  const order=await getCustomerOrder(session.id,id);
  return order?NextResponse.json(order):NextResponse.json({error:"Request not found."},{status:404});
}
