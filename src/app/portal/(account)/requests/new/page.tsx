import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RequestForm } from "@/components/portal/RequestForm";

export const metadata:Metadata={title:"New support request",robots:{index:false,follow:false}};

export default function NewRequestPage(){
  return <div className="mx-auto max-w-4xl"><Link href="/portal/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-[#607086] hover:text-[#0b6b42]"><ArrowLeft size={16}/>Back to dashboard</Link><h1 className="brand-serif mt-5 text-4xl font-bold tracking-[-.04em] text-[#0b1f3a] md:text-5xl">New support request</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#607086]">Tell us what you need. The admin will review the request and provide the next step or quotation.</p><RequestForm/></div>;
}
