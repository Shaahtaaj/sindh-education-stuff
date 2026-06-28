import { Schema, model, models } from "mongoose";
const schema=new Schema({question:{type:String,required:true},answer:{type:String,required:true},order:{type:Number,default:0},status:{type:String,enum:["draft","published"],default:"published"}},{timestamps:true});
export const FAQ=models.FAQ||model("FAQ",schema);
