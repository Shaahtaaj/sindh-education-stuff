import { Schema, model, models } from "mongoose";
const schema=new Schema({
  name:{type:String,required:true,trim:true},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  phone:{type:String,trim:true},
  passwordHash:{type:String,required:true},
  role:{type:String,enum:["super_admin","editor","order_manager","customer"],default:"customer"},
  status:{type:String,enum:["active","inactive"],default:"active"}
},{timestamps:true});
export const User=models.User||model("User",schema);
