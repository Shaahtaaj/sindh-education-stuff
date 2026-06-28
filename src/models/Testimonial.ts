import { Schema, model, models } from "mongoose";
const schema=new Schema({name:{type:String,required:true},program:String,quote:{type:String,required:true},rating:{type:Number,min:1,max:5,default:5},status:{type:String,enum:["draft","published"],default:"draft"}},{timestamps:true});
export const Testimonial=models.Testimonial||model("Testimonial",schema);
