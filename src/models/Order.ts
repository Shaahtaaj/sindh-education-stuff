import { Schema, model, models } from "mongoose";
const schema=new Schema({studentName:{type:String,required:true},phone:{type:String,required:true},email:String,program:String,courseCode:String,serviceType:String,deadline:Date,message:String,uploadedFileUrl:String,paymentScreenshotUrl:String,price:{type:Number,min:0,default:0},paymentStatus:{type:String,enum:["unpaid","pending","paid","refunded"],default:"unpaid"},orderStatus:{type:String,enum:["new","waiting_for_payment","in_progress","completed","cancelled"],default:"new"},adminNotes:String},{timestamps:true});
schema.index({createdAt:-1,orderStatus:1});
export const Order=models.Order||model("Order",schema);
