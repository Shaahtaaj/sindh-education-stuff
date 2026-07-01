import "server-only";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";

export type PortalOrder={
  id:string;reference:string;program:string;courseCode:string;serviceType:string;
  deadline:string;message:string;price:number;paymentStatus:string;orderStatus:string;
  deliveryFiles:{name:string;url:string}[];statusHistory:{status:string;label:string;at:string}[];
  createdAt:string;updatedAt:string;
};

function toPortalOrder(value:Record<string,unknown>):PortalOrder{
  const id=String(value._id??"");
  const history=Array.isArray(value.statusHistory)?value.statusHistory.flatMap(entry=>{
    if(!entry||typeof entry!=="object")return[];
    const row=entry as Record<string,unknown>;
    return [{status:String(row.status??""),label:String(row.label??""),at:new Date(String(row.at??Date.now())).toISOString()}];
  }):[];
  const files=Array.isArray(value.deliveryFiles)?value.deliveryFiles.flatMap((entry,index)=>{
    if(!entry||typeof entry!=="object")return[];
    const row=entry as Record<string,unknown>;
    const publicId=String(row.publicId??"");
    const url=publicId?`/api/portal/requests/${id}/files/${index}`:String(row.url??"");
    return url?[{name:String(row.name??"Download"),url}]:[];
  }):[];
  return {
    id,reference:id.slice(-8).toUpperCase(),program:String(value.program??""),
    courseCode:String(value.courseCode??""),serviceType:String(value.serviceType??""),
    deadline:new Date(String(value.deadline??Date.now())).toISOString(),message:String(value.message??""),
    price:Number(value.price)||0,paymentStatus:String(value.paymentStatus??"unpaid"),
    orderStatus:String(value.orderStatus??"new"),deliveryFiles:files,statusHistory:history,
    createdAt:new Date(String(value.createdAt??Date.now())).toISOString(),
    updatedAt:new Date(String(value.updatedAt??Date.now())).toISOString()
  };
}

export async function getCustomerOrders(customerId:string){
  await connectDB();
  const rows=await Order.find({customerId}).sort({createdAt:-1}).limit(100).lean();
  return rows.map(row=>toPortalOrder(row as unknown as Record<string,unknown>));
}

export async function getCustomerOrder(customerId:string,id:string){
  if(!mongoose.isValidObjectId(id))return null;
  await connectDB();
  const row=await Order.findOne({_id:id,customerId}).lean();
  return row?toPortalOrder(row as unknown as Record<string,unknown>):null;
}
