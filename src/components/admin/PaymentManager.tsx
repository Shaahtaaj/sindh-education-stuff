"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleDollarSign, Clock3, RefreshCw, RotateCcw, Search, WalletCards } from "lucide-react";

type Order = {
  _id:string; studentName:string; phone:string; courseCode:string; serviceType:string;
  price?:number; paymentStatus:"unpaid"|"pending"|"paid"|"refunded";
  orderStatus:string; createdAt:string; updatedAt:string; paymentScreenshotUrl?:string;
  paymentProofPublicId?:string;paymentTransactionId?:string;paymentSubmittedAt?:string;
};

const money=(value:number)=>new Intl.NumberFormat("en-PK",{style:"currency",currency:"PKR",maximumFractionDigits:0}).format(value);

export function PaymentManager(){
  const [orders,setOrders]=useState<Order[]>([]);
  const [loading,setLoading]=useState(true);
  const [query,setQuery]=useState("");
  const [error,setError]=useState("");
  async function load(){setLoading(true);setError("");const response=await fetch("/api/orders",{cache:"no-store"});const body=await response.json();if(response.ok)setOrders(body);else setError(body.error??"Unable to load payments.");setLoading(false)}
  useEffect(()=>{void load()},[]);
  const payments=useMemo(()=>orders.filter(order=>order.paymentStatus!=="unpaid"&&`${order.studentName} ${order.courseCode} ${order.serviceType}`.toLowerCase().includes(query.toLowerCase())),[orders,query]);
  const paidTotal=orders.filter(x=>x.paymentStatus==="paid").reduce((sum,x)=>sum+(Number(x.price)||0),0);
  const pendingTotal=orders.filter(x=>x.paymentStatus==="pending").reduce((sum,x)=>sum+(Number(x.price)||0),0);
  const refundedTotal=orders.filter(x=>x.paymentStatus==="refunded").reduce((sum,x)=>sum+(Number(x.price)||0),0);
  return <>
    <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#147a4b]">Financial overview</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.045em] text-[#0b1f3a] md:text-4xl">Payments</h1><p className="mt-2 text-sm leading-6 text-[#607086]">Paid and pending amounts are calculated from real student orders.</p></div><button onClick={()=>void load()} className="inline-flex items-center gap-2 rounded-xl border border-[#d7e0e7] bg-white px-4 py-3 text-sm font-bold text-[#405169]"><RefreshCw size={17} className={loading?"animate-spin":""}/>Refresh</button></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
      ["Confirmed revenue",money(paidTotal),CircleDollarSign,"bg-[#eaf6ef] text-[#147a4b]"],
      ["Pending amount",money(pendingTotal),Clock3,"bg-[#fff4e5] text-[#b76a19]"],
      ["Refunded",money(refundedTotal),RotateCcw,"bg-red-50 text-red-700"],
      ["Payment records",payments.length,WalletCards,"bg-[#eaf2fb] text-[#276a9d]"]
    ].map(([label,value,Icon,tone])=>{const I=Icon as typeof CircleDollarSign;return <div key={label as string} className="rounded-2xl border border-[#dfe6ec] bg-white p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.06em] text-[#718094]">{label as string}</p><p className="mt-3 text-2xl font-extrabold tracking-[-.04em] text-[#0b1f3a]">{value as string|number}</p></div><span className={`grid size-10 place-items-center rounded-xl ${tone}`}><I size={18}/></span></div></div>})}</div>
    <section className="mt-6 overflow-hidden rounded-2xl border border-[#dfe6ec] bg-white shadow-[0_8px_30px_rgba(11,31,58,.04)]"><div className="border-b border-[#e5ebef] p-4"><label className="flex max-w-md items-center gap-3 rounded-xl bg-[#f4f7f9] px-4 py-3 text-[#607086]"><Search size={17}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search payment records" className="min-w-0 flex-1 bg-transparent text-sm text-[#0b1f3a] outline-none"/></label></div>{error?<p className="bg-red-50 px-5 py-3 text-sm font-bold text-red-700">{error}</p>:null}<div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead><tr className="bg-[#f8fafb] text-[10px] font-extrabold uppercase tracking-[.09em] text-[#718094]"><th className="px-5 py-4">Student</th><th className="px-4 py-4">Order</th><th className="px-4 py-4">Amount</th><th className="px-4 py-4">Payment status</th><th className="px-4 py-4">Transaction ID</th><th className="px-4 py-4">Date</th><th className="px-5 py-4">Proof</th></tr></thead><tbody>{payments.map(order=><tr key={order._id} className="border-t border-[#edf1f4]"><td className="px-5 py-4"><p className="text-sm font-extrabold text-[#0b1f3a]">{order.studentName}</p><p className="mt-1 text-[11px] text-[#718094]">{order.phone}</p></td><td className="px-4 py-4"><p className="text-sm font-bold text-[#405169]">#{order._id.slice(0,8).toUpperCase()}</p><p className="mt-1 text-[11px] text-[#718094]">{order.courseCode} · {order.serviceType}</p></td><td className="px-4 py-4 text-sm font-extrabold text-[#0b1f3a]">{money(Number(order.price)||0)}</td><td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${order.paymentStatus==="paid"?"bg-[#eaf6ef] text-[#147a4b]":order.paymentStatus==="pending"?"bg-[#fff4e5] text-[#9a5b19]":"bg-red-50 text-red-700"}`}>{order.paymentStatus[0].toUpperCase()+order.paymentStatus.slice(1)}</span></td><td className="px-4 py-4 text-xs font-bold text-[#405169]">{order.paymentTransactionId||"—"}</td><td className="px-4 py-4 text-sm text-[#607086]">{new Intl.DateTimeFormat("en-PK",{day:"numeric",month:"short",year:"numeric"}).format(new Date(order.paymentSubmittedAt||order.updatedAt))}</td><td className="px-5 py-4">{order.paymentProofPublicId||order.paymentScreenshotUrl?<a href={`/api/admin/orders/${order._id}/payment-proof`} target="_blank" className="text-xs font-bold text-[#147a4b]">View private proof</a>:<span className="text-xs text-[#9aa6b3]">No proof</span>}</td></tr>)}</tbody></table>{!loading&&!payments.length?<div className="grid min-h-52 place-items-center text-center"><div><WalletCards className="mx-auto text-[#9aa6b3]"/><p className="mt-3 font-bold text-[#0b1f3a]">No payment records yet</p><p className="mt-1 text-sm text-[#718094]">Send a quotation to a customer to begin the payment workflow.</p></div></div>:null}</div></section>
  </>;
}
