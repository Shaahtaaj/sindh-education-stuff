import { Schema, model, models } from "mongoose";
const schema=new Schema({siteName:String,logoUrl:String,whatsappNumber:String,email:String,address:String,facebookUrl:String,youtubeUrl:String,tiktokUrl:String,jazzCashNumber:String,easyPaisaNumber:String,bankDetails:String,adsenseCode:String,googleAnalyticsCode:String,privacyText:String,disclaimerText:String},{timestamps:true});
export const Setting=models.Setting||model("Setting",schema);
