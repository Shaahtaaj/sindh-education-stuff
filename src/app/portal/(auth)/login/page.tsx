import type { Metadata } from "next";
import { CustomerAuthForm } from "@/components/portal/CustomerAuthForm";

export const metadata:Metadata={title:"Customer sign in",robots:{index:false,follow:false}};

export default function CustomerLoginPage(){
  return <section className="portal-auth-card portal-enter"><p className="portal-overline">Customer portal</p><h1>Welcome back</h1><p className="portal-auth-intro">Sign in to view requests, payment updates and delivered files.</p><CustomerAuthForm mode="login"/></section>;
}
