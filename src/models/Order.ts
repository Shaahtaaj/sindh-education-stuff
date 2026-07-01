import { Schema, model, models } from "mongoose";
const schema=new Schema({
  customerId:{type:Schema.Types.ObjectId,ref:"User",index:true},
  studentName:{type:String,required:true},
  phone:{type:String,required:true},
  email:String,
  program:String,
  courseCode:String,
  serviceType:String,
  deadline:Date,
  message:String,
  uploadedFileUrl:String,
  paymentScreenshotUrl:String,
  deliveryFiles:[{
    name:{type:String,required:true},url:String,publicId:String,format:String,
    resourceType:{type:String,default:"raw"},deliveryType:{type:String,default:"private"}
  }],
  price:{type:Number,min:0,default:0},
  paymentStatus:{type:String,enum:["unpaid","pending","paid","refunded"],default:"unpaid"},
  orderStatus:{type:String,enum:["new","waiting_for_payment","in_progress","completed","cancelled"],default:"new"},
  adminNotes:String,
  statusHistory:[{
    status:{type:String,required:true},
    label:{type:String,required:true},
    at:{type:Date,default:Date.now}
  }]
},{timestamps:true});
schema.index({createdAt:-1,orderStatus:1});
schema.index({customerId:1,createdAt:-1});
export const Order=models.Order||model("Order",schema);
