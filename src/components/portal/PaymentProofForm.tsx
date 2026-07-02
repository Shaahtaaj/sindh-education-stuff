"use client";

import {
  Check,
  CheckCircle2,
  Clipboard,
  Clock3,
  ImagePlus,
  MessageCircle,
  ShieldCheck,
  UploadCloud,
  WalletCards,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

type PaymentDetails={
  id:string;
  reference:string;
  price:number;
  paymentStatus:string;
  paymentMethod:string;
  paymentAccountTitle:string;
  paymentAccountNumber:string;
  paymentInstructions:string;
  paymentTransactionId:string;
  paymentProofSubmitted:boolean;
  paymentSubmittedAt:string|null;
  paymentVerifiedAt:string|null;
  paymentRejectionReason:string;
};

export function PaymentProofForm({order}:{order:PaymentDetails}){
  const router=useRouter();
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [copied,setCopied]=useState("");

  async function copy(value:string,label:string){
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(()=>setCopied(""),1800);
  }

  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    setLoading(true);
    setError("");
    const data=new FormData(event.currentTarget);
    try{
      const response=await fetch(`/api/portal/requests/${order.id}/payment`,{
        method:"POST",
        body:data
      });
      const body=await response.json();
      if(!response.ok)throw new Error(body.error??"Unable to submit payment proof.");
      event.currentTarget.reset();
      router.refresh();
    }catch(problem){
      setError(problem instanceof Error?problem.message:"Unable to submit payment proof.");
    }finally{
      setLoading(false);
    }
  }

  const message=`Assalam-o-Alaikum, I need help with payment for request SES-${order.reference} (PKR ${order.price.toLocaleString()}).`;

  if(order.paymentStatus==="paid"){
    return <section className="portal-panel portal-payment-card portal-payment-confirmed">
      <span className="portal-payment-result-icon"><CheckCircle2 size={24}/></span>
      <div><p className="portal-overline">Payment confirmed</p><h2>PKR {order.price.toLocaleString()}</h2><p>Your payment has been verified. Work can now proceed on this request.</p>{order.paymentVerifiedAt?<small>Verified {new Date(order.paymentVerifiedAt).toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"})}</small>:null}</div>
    </section>;
  }

  if(!order.price||!order.paymentAccountNumber){
    return <section className="portal-panel portal-payment-card">
      <div className="portal-panel-heading"><div><p className="portal-overline">Quotation</p><h2>Payment</h2></div><WalletCards size={20} className="text-[#0b8f58]"/></div>
      <div className="portal-payment-wait"><Clock3 size={19}/><div><strong>Quotation pending</strong><p>The agreed amount and payment instructions will appear here after admin review.</p></div></div>
    </section>;
  }

  return <section className="portal-panel portal-payment-card portal-payment-action">
    <div className="portal-panel-heading"><div><p className="portal-overline">Payment required</p><h2>Complete payment</h2></div><WalletCards size={20} className="text-[#0b8f58]"/></div>
    <div className="portal-price-row"><span>Quoted total</span><strong>PKR {order.price.toLocaleString()}</strong></div>

    <div className="portal-payment-details">
      <div><span>Method</span><strong>{order.paymentMethod||"Raast / bank transfer"}</strong></div>
      <div><span>Account title</span><strong>{order.paymentAccountTitle}</strong></div>
      <div>
        <span>Account / Raast ID</span>
        <strong>{order.paymentAccountNumber}</strong>
        <button type="button" onClick={()=>void copy(order.paymentAccountNumber,"account")}><Clipboard size={14}/>{copied==="account"?"Copied":"Copy"}</button>
      </div>
      <div><span>Payment reference</span><strong>SES-{order.reference}</strong><button type="button" onClick={()=>void copy(`SES-${order.reference}`,"reference")}><Clipboard size={14}/>{copied==="reference"?"Copied":"Copy"}</button></div>
    </div>

    {order.paymentInstructions?<p className="portal-payment-instructions">{order.paymentInstructions}</p>:null}
    {order.paymentRejectionReason?<p className="portal-payment-rejected"><strong>Previous proof needs attention:</strong> {order.paymentRejectionReason}</p>:null}

    {order.paymentStatus==="pending"?<div className="portal-payment-pending"><Clock3 size={19}/><div><strong>Proof submitted—verification pending</strong><p>Transaction ID: {order.paymentTransactionId}. You can replace the proof below if needed.</p></div></div>:null}

    <form onSubmit={submit} className="portal-proof-form">
      <label className="portal-field"><span>Transaction ID / reference</span><input name="transactionId" required minLength={4} maxLength={100} defaultValue={order.paymentTransactionId} placeholder="Enter the transaction ID from your receipt"/></label>
      <label className="portal-proof-upload"><ImagePlus size={20}/><span><strong>{order.paymentProofSubmitted?"Replace payment proof":"Upload payment proof"}</strong><small>JPG, PNG or WebP · maximum 3 MB</small></span><input name="proof" type="file" required accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"/></label>
      {error?<p role="alert" className="portal-form-error">{error}</p>:null}
      <button disabled={loading} className="portal-primary-button w-full"><UploadCloud size={17}/>{loading?"Uploading…":order.paymentProofSubmitted?"Update proof":"I have paid — submit proof"}</button>
    </form>

    <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="portal-payment-help"><MessageCircle size={16}/>Need payment help? Contact us on WhatsApp</a>
    <p className="portal-payment-security"><ShieldCheck size={15}/>Proof is stored privately and must be verified by admin.</p>
  </section>;
}
