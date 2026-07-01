import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { RequestForm } from "@/components/portal/RequestForm";

export const metadata:Metadata={title:"New support request",robots:{index:false,follow:false}};

export default function NewRequestPage(){
  return <div className="portal-page portal-enter mx-auto max-w-5xl">
    <Link href="/portal/dashboard" className="portal-back-link"><ArrowLeft size={16}/>Back to dashboard</Link>
    <div className="portal-page-heading mt-5"><div><h1>New support request</h1><p>Share the request once. We&apos;ll keep the quotation, progress and delivery organised here.</p></div><span className="portal-heading-icon"><Sparkles size={22}/></span></div>
    <RequestForm/>
  </div>;
}
