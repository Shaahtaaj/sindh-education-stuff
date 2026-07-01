import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock3, Download, WalletCards } from "lucide-react";
import { getCustomerSession } from "@/lib/customer-auth";
import { getCustomerOrder } from "@/lib/portal-orders";

export const metadata:Metadata={title:"Request details",robots:{index:false,follow:false}};
const steps=[
  {status:"new",label:"Request submitted"},
  {status:"waiting_for_payment",label:"Quote and payment"},
  {status:"in_progress",label:"Work in progress"},
  {status:"completed",label:"Delivered"}
];
const orderIndex:Record<string,number>={new:0,waiting_for_payment:1,in_progress:2,completed:3};

export default async function RequestDetailsPage({params}:{params:Promise<{id:string}>}){
  const session=await getCustomerSession();const {id}=await params;
  const order=session?await getCustomerOrder(session.id,id):null;if(!order)notFound();
  const current=orderIndex[order.orderStatus]??0;
  return <div className="mx-auto max-w-5xl"><Link href="/portal/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-[#607086] hover:text-[#0b6b42]"><ArrowLeft size={16}/>Back to dashboard</Link><div className="mt-5 flex flex-wrap items-start justify-between gap-5"><div><p className="text-xs font-extrabold uppercase tracking-[.1em] text-[#0b6b42]">Request #{order.reference}</p><h1 className="brand-serif mt-2 text-4xl font-bold tracking-[-.04em] text-[#0b1f3a] md:text-5xl">{order.courseCode} · {order.serviceType}</h1></div><span className="rounded-full bg-[#e8f4ed] px-3 py-1.5 text-xs font-bold text-[#0b6b42]">{order.orderStatus.replaceAll("_"," ")}</span></div>
    <section className="mt-8 rounded-2xl border border-[#dfe5e2] bg-white p-5 md:p-7"><h2 className="text-lg font-extrabold text-[#0b1f3a]">Progress</h2><div className="mt-6 grid gap-5 md:grid-cols-4">{steps.map((step,index)=>{const done=index<=current&&order.orderStatus!=="cancelled";return <div key={step.status} className="relative"><span className={`grid size-9 place-items-center rounded-full ${done?"bg-[#0b6b42] text-white":"bg-[#edf0ef] text-[#8a97a6]"}`}>{done?<Check size={17}/>:<span className="text-xs font-bold">{index+1}</span>}</span><p className={`mt-3 text-sm font-bold ${done?"text-[#0b1f3a]":"text-[#788697]"}`}>{step.label}</p></div>})}</div></section>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]"><section className="rounded-2xl border border-[#dfe5e2] bg-white p-5 md:p-7"><h2 className="text-lg font-extrabold text-[#0b1f3a]">Request details</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><div><dt className="text-xs font-bold uppercase tracking-[.07em] text-[#788697]">Program</dt><dd className="mt-1 font-semibold text-[#26374d]">{order.program}</dd></div><div><dt className="text-xs font-bold uppercase tracking-[.07em] text-[#788697]">Deadline</dt><dd className="mt-1 font-semibold text-[#26374d]">{new Date(order.deadline).toLocaleDateString("en-PK",{day:"numeric",month:"long",year:"numeric"})}</dd></div><div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-[.07em] text-[#788697]">Instructions</dt><dd className="mt-2 whitespace-pre-line text-sm leading-7 text-[#526277]">{order.message}</dd></div></dl></section>
      <aside className="grid gap-6"><section className="rounded-2xl border border-[#dfe5e2] bg-white p-5"><div className="flex items-center gap-3"><WalletCards size={20} className="text-[#0b6b42]"/><h2 className="font-extrabold text-[#0b1f3a]">Payment</h2></div><p className="mt-4 text-2xl font-extrabold text-[#0b1f3a]">{order.price?`PKR ${order.price.toLocaleString()}`:"Pending quote"}</p><p className="mt-1 text-sm capitalize text-[#667589]">{order.paymentStatus.replaceAll("_"," ")}</p></section><section className="rounded-2xl border border-[#dfe5e2] bg-white p-5"><div className="flex items-center gap-3"><Download size={20} className="text-[#0b6b42]"/><h2 className="font-extrabold text-[#0b1f3a]">Delivery files</h2></div>{order.deliveryFiles.length?<div className="mt-4 grid gap-2">{order.deliveryFiles.map(file=><a key={file.url} href={file.url} className="rounded-xl bg-[#e8f4ed] px-4 py-3 text-sm font-bold text-[#0b6b42]">{file.name}</a>)}</div>:<p className="mt-4 flex items-start gap-2 text-sm leading-6 text-[#667589]"><Clock3 size={17} className="mt-1 shrink-0"/>Files will appear here after delivery.</p>}</section></aside></div>
  </div>;
}
