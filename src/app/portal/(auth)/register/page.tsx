import type { Metadata } from "next";
import { CustomerAuthForm } from "@/components/portal/CustomerAuthForm";

export const metadata:Metadata={title:"Create customer account",robots:{index:false,follow:false}};

export default function CustomerRegisterPage(){
  return <section className="portal-auth-card portal-enter"><p className="portal-overline">Customer portal</p><h1>Create your account</h1><p className="portal-auth-intro">Keep every support request, update and delivery organised securely.</p><CustomerAuthForm mode="register"/></section>;
}
