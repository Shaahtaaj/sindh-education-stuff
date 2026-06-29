import "server-only";
import mongoose from "mongoose";
import { connectDB } from "./db";
import { readLocalCollection } from "./local-store";

export type PublicMaterial={
  id:string;title:string;slug:string;program:string;course:string;courseCode:string;
  semester:string;category:string;type:string;language:string;description:string;
  content:string;files:{name:string;url:string}[];fileUrl:string;thumbnailUrl:string;isFree:boolean;price:number;
  tags:string[];seoTitle:string;metaDescription:string;downloads:number;status:string;updatedAt:string;
};
export type PublicBlog={
  id:string;title:string;slug:string;category:string;excerpt:string;content:string;
  featuredImage:string;author:string;tags:string[];seoTitle:string;metaDescription:string;
  status:string;publishDate:string;updatedAt:string;readTime:string;
};

async function rawCollection<T>(mongoName:string,localName:string):Promise<T[]>{
  try{await connectDB();return (await mongoose.connection.db!.collection(mongoName).find({}).sort({createdAt:-1}).toArray()).map(row=>{const {_id,...value}=row;return value as T})}
  catch{return readLocalCollection<T>(localName)}
}

export async function getPublicMaterials():Promise<PublicMaterial[]>{
  const rows=await rawCollection<Record<string,unknown>>("admin_materials","admin-materials");
  return rows.filter(row=>row.status==="Published").map(row=>{
    const course=String(row.course??"");
    const legacyUrl=String(row.fileUrl??"");
    const files=Array.isArray(row.files)?row.files.flatMap(file=>{if(!file||typeof file!=="object")return[];const value=file as Record<string,unknown>;const url=String(value.url??"");return url?[{name:String(value.name??"Download"),url}]:[]}):[];
    if(!files.length&&legacyUrl)files.push({name:String(row.fileName??"Download"),url:legacyUrl});
    return {id:String(row.id??""),title:String(row.title??""),slug:String(row.slug??""),program:String(row.program??""),course,courseCode:course.split(" — ")[0]||"General",semester:String(row.semester??""),category:String(row.category??""),type:String(row.type??""),language:String(row.language??""),description:String(row.description??""),content:String(row.content??""),files,fileUrl:files[0]?.url??legacyUrl,thumbnailUrl:String(row.thumbnailUrl??""),isFree:row.access==="Free",price:Number(row.price)||0,tags:String(row.tags??"").split(",").map(tag=>tag.trim()).filter(Boolean),seoTitle:String(row.seoTitle??""),metaDescription:String(row.metaDescription??""),downloads:Number(row.downloads)||0,status:String(row.status??""),updatedAt:String(row.updatedAt??row.createdAt??new Date().toISOString())};
  });
}
export async function getPublicMaterial(slug:string){return (await getPublicMaterials()).find(item=>item.slug===slug)}

export async function getPublicBlogs():Promise<PublicBlog[]>{
  const rows=await rawCollection<Record<string,unknown>>("admin_blogs","admin-blogs");
  return rows.filter(row=>row.status==="Published").map(row=>{const content=String(row.content??"");return {id:String(row.id??""),title:String(row.title??""),slug:String(row.slug??""),category:String(row.category??""),excerpt:String(row.excerpt??""),content,featuredImage:String(row.featuredImage??""),author:String(row.author??"Editorial Team"),tags:String(row.tags??"").split(",").map(tag=>tag.trim()).filter(Boolean),seoTitle:String(row.seoTitle??""),metaDescription:String(row.metaDescription??""),status:String(row.status??""),publishDate:String(row.publishDate??row.createdAt??new Date().toISOString()),updatedAt:String(row.updatedAt??row.createdAt??new Date().toISOString()),readTime:`${Math.max(1,Math.ceil(content.split(/\\s+/).length/220))} min read`}})
}
export async function getPublicBlog(slug:string){return (await getPublicBlogs()).find(item=>item.slug===slug)}

export async function getPublicGeneric(collection:string){
  const rows=await rawCollection<{id:string;values:string[]}>(`admin_${collection.replace(/-/g,"_")}`,`admin-${collection}`);
  return rows.filter(row=>{const status=row.values.at(-1)?.toLowerCase();return status==="published"||status==="active"||status==="upcoming"});
}
