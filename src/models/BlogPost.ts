import { Schema, model, models } from "mongoose";
const schema=new Schema({title:{type:String,required:true},slug:{type:String,required:true,unique:true,index:true},category:String,excerpt:String,content:String,featuredImage:String,author:String,tags:[String],seoTitle:String,metaDescription:String,status:{type:String,enum:["draft","published"],default:"draft"}},{timestamps:true});
schema.index({title:"text",excerpt:"text",content:"text"});
export const BlogPost=models.BlogPost||model("BlogPost",schema);
