import { notFound } from "next/navigation";
import { AdminModuleManager } from "@/components/admin/AdminModuleManager";

const modules: Record<string,{title:string;description:string;columns:string[]}> = {
  programs:{title:"Programs",description:"Manage study programs and public availability.",columns:["Program","Slug","Description","Status"]},
  courses:{title:"Courses",description:"Organize course codes under their programs.",columns:["Code","Course name","Program","Semester","Status"]},
  semesters:{title:"Semesters",description:"Create reusable semesters such as Spring 2026 or Autumn 2027.",columns:["Semester","Status"]},
  "blog-posts":{title:"Blog Posts",description:"Create useful, search-friendly student guidance.",columns:["Title","Category","Author","Status","Updated"]},
  "assignment-dates":{title:"Assignment Dates",description:"Maintain unofficial planning dates with clear verification notes.",columns:["Program","Semester","Assignment","Due","Status"]},
  faqs:{title:"FAQs",description:"Maintain clear answers shown across the public site.",columns:["Question","Answer","Order","Status"]},
  testimonials:{title:"Testimonials",description:"Review consented student feedback before publication.",columns:["Name","Program","Quote","Rating","Status"]},
  "website-settings":{title:"Website Settings",description:"Manage contact information, social links and payment details.",columns:["Setting","Value","Status"]},
  "seo-settings":{title:"SEO Settings",description:"Control site metadata, canonical URL and analytics configuration.",columns:["Setting","Value","Status"]},
  "adsense-settings":{title:"AdSense Settings",description:"Add approved AdSense configuration. Ads remain disabled until configured.",columns:["Slot","Location","Code","Status"]}
};

export default async function Page({params}:{params:Promise<{module:string}>}) {
  const {module}=await params;
  const data=modules[module];
  if(!data)notFound();
  return <AdminModuleManager moduleKey={module} title={data.title} description={data.description} columns={data.columns}/>;
}
