import { Schema, model, models } from "mongoose";
const schema=new Schema({orderId:{type:Schema.Types.ObjectId,ref:"Order",required:true},method:{type:String,enum:["jazzcash","easypaisa","bank","other"]},amount:{type:Number,min:0,required:true},transactionReference:String,screenshotUrl:String,status:{type:String,enum:["pending","verified","rejected","refunded"],default:"pending"},verifiedBy:{type:Schema.Types.ObjectId,ref:"User"}},{timestamps:true});
export const Payment=models.Payment||model("Payment",schema);
