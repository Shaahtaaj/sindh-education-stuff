import { Schema, model, models } from "mongoose";
const schema=new Schema({program:{type:String,required:true},semester:{type:String,required:true},assignment:{type:String,required:true},dueDate:{type:Date,required:true},status:{type:String,enum:["upcoming","extended","closed"],default:"upcoming"}},{timestamps:true});
export const AssignmentDate=models.AssignmentDate||model("AssignmentDate",schema);
