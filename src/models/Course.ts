import { Schema, model, models } from "mongoose";
const schema=new Schema({programId:{type:Schema.Types.ObjectId,ref:"Program",required:true},courseCode:{type:String,required:true,index:true},courseName:{type:String,required:true},semester:String,creditHours:Number,language:{type:String,default:"English"},description:String,status:{type:String,enum:["draft","published"],default:"published"}},{timestamps:true});
schema.index({courseCode:1,programId:1},{unique:true});
export const Course=models.Course||model("Course",schema);
