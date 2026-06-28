import { Schema, model, models } from "mongoose";
const schema=new Schema({title:{type:String,required:true,trim:true},slug:{type:String,required:true,unique:true,index:true},description:{type:String,default:""},status:{type:String,enum:["draft","published"],default:"published"}},{timestamps:true});
export const Program=models.Program||model("Program",schema);
