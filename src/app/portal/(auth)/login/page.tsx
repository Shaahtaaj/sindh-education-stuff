import type { Metadata } from "next";
import { CustomerAuthForm } from "@/components/portal/CustomerAuthForm";

export const metadata:Metadata={title:"Customer sign in",robots:{index:false,follow:false}};

export default function CustomerLoginPage(){
  return <section className="w-full max-w-md rounded-3xl border border-[#dfe5e2] bg-white p-6 shadow-[0_24px_70px_rgba(11,31,58,.08)] md:p-9"><h1 className="brand-serif text-4xl font-bold tracking-[-.04em] text-[#0b1f3a]">Welcome back</h1><p className="mt-3 text-sm leading-6 text-[#607086]">Sign in to view requests, payments and delivered files.</p><CustomerAuthForm mode="login"/></section>;
}
