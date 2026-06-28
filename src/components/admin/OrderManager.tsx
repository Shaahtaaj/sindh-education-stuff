"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays, Check, ChevronDown, Download, ExternalLink, FileText,
  Image as ImageIcon, Mail, MessageCircle, RefreshCw, Search, ShoppingBag, X
} from "lucide-react";

type Order = {
  _id: string; studentName: string; phone: string; email?: string; program: string;
  courseCode: string; serviceType: string; deadline: string; message: string;
  uploadedFileUrl?: string; paymentScreenshotUrl?: string; price?: number;
  paymentStatus: "unpaid"|"pending"|"paid"|"refunded";
  orderStatus: "new"|"waiting_for_payment"|"in_progress"|"completed"|"cancelled";
  adminNotes?: string; createdAt: string; updatedAt: string;
};

const orderStatuses = ["new","waiting_for_payment","in_progress","completed","cancelled"];
const paymentStatuses = ["unpaid","pending","paid","refunded"];
const labels: Record<string,string> = {
  new:"New",waiting_for_payment:"Waiting for payment",in_progress:"In progress",
  completed:"Completed",cancelled:"Cancelled",unpaid:"Unpaid",pending:"Pending",
  paid:"Paid",refunded:"Refunded"
};
const inputClass="focus-ring w-full rounded-xl border border-[#d7e0e7] bg-white px-4 py-3 text-sm font-semibold text-[#0b1f3a]";

export function OrderManager() {
  const [orders,setOrders]=useState<Order[]>([]);
  const [selected,setSelected]=useState<Order|null>(null);
  const [query,setQuery]=useState("");
  const [filter,setFilter]=useState("all");
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");

  async function load() {
    setLoading(true);setError("");
    const response=await fetch("/api/orders",{cache:"no-store"});
    const body=await response.json();
    if(response.ok)setOrders(body as Order[]);else setError(body.error??"Unable to load orders.");
    setLoading(false);
  }
  useEffect(()=>{void load()},[]);

  const visible=useMemo(()=>orders.filter(order=>{
    const match=`${order.studentName} ${order.phone} ${order.courseCode} ${order.serviceType}`.toLowerCase().includes(query.toLowerCase());
    return match&&(filter==="all"||order.orderStatus===filter);
  }),[orders,query,filter]);

  async function update(changes:Partial<Order>) {
    if(!selected)return;
    setSaving(true);setError("");
    const response=await fetch("/api/orders",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:selected._id,...changes})});
    const body=await response.json();
    if(response.ok){const updated=body as Order;setOrders(current=>current.map(order=>order._id===updated._id?updated:order));setSelected(updated);setNotice(changes.paymentStatus==="paid"?"Payment confirmed and order moved to In progress.":"Order updated successfully.");}
    else setError(body.error??"Unable to update order.");
    setSaving(false);
  }

  return <>
    <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#147a4b]">Student support</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.045em] text-[#0b1f3a] md:text-4xl">Orders</h1><p className="mt-2 text-sm leading-6 text-[#607086]">Review requests, open student attachments and manage payment and delivery progress.</p></div><button onClick={()=>void load()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-[#d7e0e7] bg-white px-4 py-3 text-sm font-bold text-[#405169] hover:bg-[#f4f7f9]"><RefreshCw size={17} className={loading?"animate-spin":""}/>Refresh orders</button></div>

    <div className="mt-7 grid gap-4 sm:grid-cols-3">{[
      ["Total orders",orders.length,"bg-[#edf2f5] text-[#0b1f3a]"],
      ["Needs review",orders.filter(x=>x.orderStatus==="new").length,"bg-[#eaf2fb] text-[#276a9d]"],
      ["With attachments",orders.filter(x=>x.uploadedFileUrl||x.paymentScreenshotUrl).length,"bg-[#eaf6ef] text-[#147a4b]"]
    ].map(([label,value,tone])=><div key={label as string} className="rounded-2xl border border-[#dfe6ec] bg-white p-5"><p className="text-xs font-bold uppercase tracking-[.06em] text-[#718094]">{label as string}</p><div className="mt-3 flex items-center justify-between"><p className="text-3xl font-extrabold text-[#0b1f3a]">{value as number}</p><span className={`grid size-10 place-items-center rounded-xl ${tone}`}><ShoppingBag size={18}/></span></div></div>)}</div>

    <section className="mt-6 overflow-hidden rounded-2xl border border-[#dfe6ec] bg-white shadow-[0_8px_30px_rgba(11,31,58,.04)]">
      <div className="flex flex-wrap items-center gap-3 border-b border-[#e5ebef] p-4"><label className="flex min-w-[240px] flex-1 items-center gap-3 rounded-xl bg-[#f4f7f9] px-4 py-3 text-[#607086] md:max-w-md"><Search size={17}/><span className="sr-only">Search orders</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Student, phone, course or service" className="min-w-0 flex-1 bg-transparent text-sm text-[#0b1f3a] outline-none"/></label><span className="relative"><select value={filter} onChange={event=>setFilter(event.target.value)} className="appearance-none rounded-xl border border-[#dfe6ec] bg-white py-3 pl-4 pr-9 text-xs font-bold text-[#53657a]"><option value="all">All statuses</option>{orderStatuses.map(status=><option key={status} value={status}>{labels[status]}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7b8999]"/></span></div>
      {error?<p className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">{error}</p>:null}
      <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left"><thead><tr className="bg-[#f8fafb] text-[10px] font-extrabold uppercase tracking-[.09em] text-[#718094]"><th className="px-5 py-4">Student</th><th className="px-4 py-4">Course & service</th><th className="px-4 py-4">Deadline</th><th className="px-4 py-4">Files</th><th className="px-4 py-4">Payment</th><th className="px-4 py-4">Order status</th><th className="px-5 py-4 text-right">Action</th></tr></thead><tbody>{visible.map(order=><tr key={order._id} className="border-t border-[#edf1f4] hover:bg-[#fbfcfd]"><td className="px-5 py-4"><p className="text-sm font-extrabold text-[#0b1f3a]">{order.studentName}</p><p className="mt-1 text-[11px] text-[#7a899a]">#{order._id.slice(0,8).toUpperCase()} · {order.phone}</p></td><td className="px-4 py-4"><p className="text-sm font-bold text-[#405169]">{order.courseCode} · {order.program}</p><p className="mt-1 text-[11px] text-[#7a899a]">{order.serviceType}</p></td><td className="px-4 py-4 text-sm text-[#53657a]">{new Intl.DateTimeFormat("en-PK",{day:"numeric",month:"short",year:"numeric"}).format(new Date(order.deadline))}</td><td className="px-4 py-4"><div className="flex gap-2">{order.uploadedFileUrl?<a href={order.uploadedFileUrl} target="_blank" className="grid size-9 place-items-center rounded-lg bg-[#eaf2fb] text-[#276a9d]" title="Open student file"><FileText size={16}/></a>:null}{order.paymentScreenshotUrl?<a href={order.paymentScreenshotUrl} target="_blank" className="grid size-9 place-items-center rounded-lg bg-[#eaf6ef] text-[#147a4b]" title="Open payment screenshot"><ImageIcon size={16}/></a>:null}{!order.uploadedFileUrl&&!order.paymentScreenshotUrl?<span className="text-xs text-[#9aa6b3]">None</span>:null}</div></td><td className="px-4 py-4"><span className={`text-xs font-bold ${order.paymentStatus==="paid"?"text-[#147a4b]":order.paymentStatus==="pending"?"text-[#b76a19]":"text-[#8a5960]"}`}>{labels[order.paymentStatus]}</span></td><td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${order.orderStatus==="completed"?"bg-[#eaf6ef] text-[#147a4b]":order.orderStatus==="new"?"bg-[#eaf2fb] text-[#276a9d]":"bg-[#f1f3f6] text-[#53657a]"}`}>{labels[order.orderStatus]}</span></td><td className="px-5 py-4 text-right"><button onClick={()=>setSelected(order)} className="rounded-lg border border-[#d7e0e7] px-3 py-2 text-xs font-bold text-[#405169] hover:bg-[#f4f7f9]">Review</button></td></tr>)}</tbody></table>{loading?<div className="grid min-h-52 place-items-center"><RefreshCw className="animate-spin text-[#147a4b]"/></div>:!visible.length?<div className="grid min-h-52 place-items-center text-center"><div><ShoppingBag className="mx-auto text-[#9aa6b3]"/><p className="mt-3 font-bold text-[#0b1f3a]">No orders found</p></div></div>:null}</div>
    </section>

    {selected?<div className="fixed inset-0 z-[60] flex justify-end bg-[#071426]/55 backdrop-blur-[2px]" onMouseDown={event=>{if(event.target===event.currentTarget&&!saving)setSelected(null)}}><aside className="h-full w-full max-w-[660px] overflow-y-auto bg-[#f4f7f9] shadow-[-24px_0_70px_rgba(3,15,30,.24)]"><header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#dfe6ec] bg-white px-6 py-5"><div><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#147a4b]">Order #{selected._id.slice(0,8).toUpperCase()}</p><h2 className="mt-1 text-xl font-extrabold text-[#0b1f3a]">{selected.studentName}</h2></div><button onClick={()=>setSelected(null)} className="grid size-10 place-items-center rounded-xl border border-[#dfe6ec]"><X size={18}/></button></header><div className="space-y-5 p-5 md:p-6">
      <section className="rounded-2xl border border-[#dfe6ec] bg-white p-5"><h3 className="text-sm font-extrabold text-[#0b1f3a]">Student and request</h3><div className="mt-4 grid gap-4 sm:grid-cols-2">{[[MessageCircle,selected.phone],[Mail,selected.email||"No email"],[CalendarDays,new Intl.DateTimeFormat("en-PK",{dateStyle:"medium"}).format(new Date(selected.deadline))],[FileText,`${selected.courseCode} · ${selected.program}`]].map(([Icon,text])=>{const I=Icon as typeof Mail;return <div key={text as string} className="flex items-center gap-3 text-sm text-[#53657a]"><I size={16} className="text-[#147a4b]"/>{text as string}</div>})}</div><p className="mt-5 rounded-xl bg-[#f4f7f9] p-4 text-sm leading-6 text-[#405169]">{selected.message}</p></section>
      <section className="rounded-2xl border border-[#dfe6ec] bg-white p-5"><h3 className="text-sm font-extrabold text-[#0b1f3a]">Attached files</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{selected.uploadedFileUrl?<a href={selected.uploadedFileUrl} target="_blank" className="flex items-center gap-3 rounded-xl border border-[#d7e0e7] p-4 hover:bg-[#f8fafb]"><span className="grid size-10 place-items-center rounded-xl bg-[#eaf2fb] text-[#276a9d]"><FileText size={18}/></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-[#0b1f3a]">Student file</span><span className="text-xs text-[#718094]">Open or download</span></span><ExternalLink size={15}/></a>:null}{selected.paymentScreenshotUrl?<a href={selected.paymentScreenshotUrl} target="_blank" className="flex items-center gap-3 rounded-xl border border-[#d7e0e7] p-4 hover:bg-[#f8fafb]"><span className="grid size-10 place-items-center rounded-xl bg-[#eaf6ef] text-[#147a4b]"><ImageIcon size={18}/></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-[#0b1f3a]">Payment screenshot</span><span className="text-xs text-[#718094]">Open image</span></span><ExternalLink size={15}/></a>:null}{!selected.uploadedFileUrl&&!selected.paymentScreenshotUrl?<p className="text-sm text-[#718094]">No files were attached to this order.</p>:null}</div></section>
      <section className="rounded-2xl border border-[#dfe6ec] bg-white p-5"><h3 className="text-sm font-extrabold text-[#0b1f3a]">Payment and progress</h3><p className="mt-1 text-xs leading-5 text-[#718094]">Enter the final agreed amount before confirming payment. Paid orders automatically move to In progress and appear in Payments.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-xs font-bold uppercase tracking-[.06em] text-[#607086]">Agreed price (PKR)<input type="number" min="0" className={inputClass} value={selected.price||0} onChange={event=>setSelected({...selected,price:Number(event.target.value)})}/></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.06em] text-[#607086]">Payment status<select className={inputClass} value={selected.paymentStatus} onChange={event=>{const status=event.target.value as Order["paymentStatus"];if(status==="paid"&&Number(selected.price)<=0){setError("Enter the agreed price before marking this order as paid.");return}void update({paymentStatus:status,price:Number(selected.price)||0})}}>{paymentStatuses.map(status=><option key={status} value={status}>{labels[status]}</option>)}</select></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.06em] text-[#607086] sm:col-span-2">Order status<select className={inputClass} value={selected.orderStatus} onChange={event=>void update({orderStatus:event.target.value as Order["orderStatus"]})}>{orderStatuses.map(status=><option key={status} value={status}>{labels[status]}</option>)}</select></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.06em] text-[#607086] sm:col-span-2">Admin notes<textarea className={inputClass} rows={5} value={selected.adminNotes||""} onChange={event=>setSelected({...selected,adminNotes:event.target.value})}/></label><button disabled={saving} onClick={()=>void update({adminNotes:selected.adminNotes||"",price:Number(selected.price)||0})} className="rounded-xl bg-[#147a4b] px-5 py-3 text-sm font-bold text-white sm:col-span-2">{saving?"Saving…":"Save price and notes"}</button></div></section>
    </div></aside></div>:null}
    {notice?<div className="fixed bottom-5 right-5 z-[80] flex items-center gap-2 rounded-xl bg-[#0b1f3a] px-4 py-3 text-sm font-bold text-white shadow-xl"><Check size={17} className="text-[#55d393]"/>{notice}<button onClick={()=>setNotice("")}><X size={15}/></button></div>:null}
  </>;
}
