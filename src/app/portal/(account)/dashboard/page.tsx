import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, FilePlus2, FolderCheck, WalletCards } from "lucide-react";
import { getCustomerSession } from "@/lib/customer-auth";
import { getCustomerOrders } from "@/lib/portal-orders";

export const metadata:Metadata={title:"Customer dashboard",robots:{index:false,follow:false}};

const statusLabel:Record<string,string>={new:"Submitted",waiting_for_payment:"Awaiting payment",in_progress:"In progress",completed:"Delivered",cancelled:"Cancelled"};
const statusTone:Record<string,string>={new:"bg-blue-50 text-blue-700",waiting_for_payment:"bg-amber-50 text-amber-700",in_progress:"bg-violet-50 text-violet-700",completed:"bg-emerald-50 text-emerald-700",cancelled:"bg-slate-100 text-slate-600"};

export default async function CustomerDashboard(){
  const session=await getCustomerSession();
  const orders=session?await getCustomerOrders(session.id):[];
  const active=orders.filter(order=>!["completed","cancelled"].includes(order.orderStatus)).length;
  const delivered=orders.filter(order=>order.orderStatus==="completed").length;
  const awaiting=orders.filter(order=>order.orderStatus==="waiting_for_payment").length;
  return <div>
    <div className="flex flex-wrap items-end justify-between gap-5"><div><h1 className="brand-serif text-4xl font-bold tracking-[-.04em] text-[#0b1f3a] md:text-5xl">Your requests</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#607086]">Track support work, payment status and delivered files from one place.</p></div><Link href="/portal/requests/new" className="inline-flex items-center gap-2 rounded-xl bg-[#0b6b42] px-5 py-3 text-sm font-bold text-white hover:bg-[#075332]"><FilePlus2 size={18}/>New request</Link></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-3">{[[Clock3,"Active",active],[WalletCards,"Awaiting payment",awaiting],[FolderCheck,"Delivered",delivered]].map(([Icon,label,value])=>{const I=Icon as typeof Clock3;return <div key={label as string} className="rounded-2xl border border-[#dfe5e2] bg-white p-5"><I size={20} className="text-[#0b6b42]"/><p className="mt-5 text-3xl font-extrabold text-[#0b1f3a]">{value as number}</p><p className="mt-1 text-sm font-semibold text-[#667589]">{label as string}</p></div>})}</div>
    <section className="mt-7 overflow-hidden rounded-2xl border border-[#dfe5e2] bg-white"><div className="flex items-center justify-between border-b border-[#e7ebe9] px-5 py-4"><h2 className="text-lg font-extrabold text-[#0b1f3a]">Recent requests</h2><span className="text-xs font-bold text-[#788697]">{orders.length} total</span></div>{orders.length?<div>{orders.slice(0,8).map(order=><Link key={order.id} href={`/portal/requests/${order.id}`} className="grid gap-3 border-b border-[#edf0ef] px-5 py-4 transition last:border-0 hover:bg-[#fafcfb] md:grid-cols-[1fr_150px_150px_24px] md:items-center"><div><p className="text-xs font-bold uppercase tracking-[.08em] text-[#0b6b42]">#{order.reference} · {order.courseCode}</p><p className="mt-1 font-bold text-[#0b1f3a]">{order.serviceType}</p></div><p className="text-sm text-[#607086]">{new Date(order.createdAt).toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"})}</p><span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${statusTone[order.orderStatus]??statusTone.new}`}>{statusLabel[order.orderStatus]??order.orderStatus}</span><ArrowRight size={17} className="text-[#8a97a6]"/></Link>)}</div>:<div className="px-6 py-14 text-center"><p className="font-bold text-[#0b1f3a]">No requests yet</p><p className="mt-2 text-sm text-[#667589]">Create your first support request when you are ready.</p></div>}</section>
  </div>;
}
