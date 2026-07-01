"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, ExternalLink, LogOut, Menu, Search, X } from "lucide-react";

const destinations = [
  ["Dashboard","/admin/dashboard"],["Programs","/admin/programs"],["Courses","/admin/courses"],
  ["Semesters","/admin/semesters"],["Materials","/admin/materials"],["Blog posts","/admin/blog-posts"],["Assignment dates","/admin/assignment-dates"],
  ["Customers","/admin/customers"],["Orders","/admin/orders"],["Payments","/admin/payments"],["FAQs","/admin/faqs"],
  ["Testimonials","/admin/testimonials"],["Website settings","/admin/website-settings"],
  ["SEO settings","/admin/seo-settings"],["AdSense settings","/admin/adsense-settings"]
] as const;

export function AdminTopbar({email,onMenu}:{email:string;onMenu:()=>void}) {
  const router=useRouter();
  const [query,setQuery]=useState("");
  const [notifications,setNotifications]=useState(false);
  const [profile,setProfile]=useState(false);
  const [ordersNeedingReview,setOrdersNeedingReview]=useState(0);
  const matches=useMemo(()=>query.trim()?destinations.filter(([label])=>label.toLowerCase().includes(query.toLowerCase())).slice(0,5):[],[query]);
  useEffect(()=>{
    let active=true;
    fetch("/api/orders",{cache:"no-store"}).then(response=>response.ok?response.json():[]).then((orders:{orderStatus:string;paymentStatus:string}[])=>{
      if(active)setOrdersNeedingReview(orders.filter(order=>order.orderStatus==="new"||order.orderStatus==="waiting_for_payment"||order.paymentStatus==="pending").length);
    }).catch(()=>{if(active)setOrdersNeedingReview(0)});
    return()=>{active=false};
  },[]);
  async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.push("/admin/login");router.refresh()}
  return <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#dfe6ec] bg-white/95 px-4 backdrop-blur md:px-7">
    <button onClick={onMenu} className="flex items-center gap-3 rounded-xl p-2 text-[#0b1f3a] lg:hidden" aria-label="Open admin navigation"><Menu/><span className="font-extrabold">Admin</span></button>
    <div className="relative hidden md:block">
      <label className="flex w-[min(34vw,420px)] items-center gap-3 rounded-xl border border-transparent bg-[#f4f7f9] px-4 py-2.5 text-[#607086] focus-within:border-[#b8d8c5] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(20,122,75,.08)]">
        <Search size={17}/><span className="sr-only">Search admin pages</span><input value={query} onChange={event=>setQuery(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"&&matches[0]){router.push(matches[0][1]);setQuery("")}}} aria-label="Search admin pages" placeholder="Search pages and settings…" className="min-w-0 flex-1 bg-transparent text-sm text-[#0b1f3a] outline-none"/>{query?<button onClick={()=>setQuery("")} aria-label="Clear search"><X size={15}/></button>:<span className="rounded border border-[#d5dde4] bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#7b8999]">↵</span>}
      </label>
      {matches.length ? <div className="absolute left-0 right-0 top-[calc(100%+.5rem)] overflow-hidden rounded-xl border border-[#dfe6ec] bg-white p-2 shadow-[0_18px_50px_rgba(11,31,58,.15)]">{matches.map(([label,href])=><Link key={href} onClick={()=>setQuery("")} href={href} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-[#405169] hover:bg-[#eaf6ef] hover:text-[#147a4b]">{label}<span className="text-xs text-[#9aa5b2]">Open</span></Link>)}</div>:null}
    </div>
    <div className="flex items-center gap-2">
      <Link href="/" target="_blank" className="hidden items-center gap-2 rounded-xl border border-[#dfe6ec] px-3.5 py-2.5 text-xs font-bold text-[#405169] hover:bg-[#f4f7f9] sm:inline-flex">View site <ExternalLink size={14}/></Link>
      <div className="relative"><button onClick={()=>{setNotifications(current=>!current);setProfile(false)}} aria-label={`Notifications${ordersNeedingReview?` — ${ordersNeedingReview} orders need review`:""}`} className="relative grid size-10 place-items-center rounded-xl border border-[#dfe6ec] text-[#53657a] hover:bg-[#f4f7f9]"><Bell size={17}/>{ordersNeedingReview>0?<span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full border-2 border-white bg-[#df8b2d] px-1 text-[9px] font-extrabold leading-4 text-white">{ordersNeedingReview>99?"99+":ordersNeedingReview}</span>:null}</button>{notifications?<div className="absolute right-0 top-12 w-80 rounded-2xl border border-[#dfe6ec] bg-white p-3 shadow-[0_20px_55px_rgba(11,31,58,.16)]"><div className="flex items-center justify-between px-2 py-2"><p className="text-sm font-extrabold text-[#0b1f3a]">Notifications</p><button onClick={()=>setNotifications(false)}><X size={15}/></button></div>{ordersNeedingReview>0?<><div className="rounded-xl bg-[#fff8ed] p-3"><p className="text-xs font-bold text-[#0b1f3a]">{ordersNeedingReview} {ordersNeedingReview===1?"order needs":"orders need"} review</p><p className="mt-1 text-xs leading-5 text-[#607086]">Open Orders to update payment and progress status.</p></div><Link onClick={()=>setNotifications(false)} href="/admin/orders" className="mt-2 block px-2 py-2 text-xs font-bold text-[#147a4b]">Review orders</Link></>:<div className="rounded-xl bg-[#f4f7f9] p-4 text-center"><p className="text-xs font-bold text-[#0b1f3a]">You are all caught up</p><p className="mt-1 text-xs leading-5 text-[#607086]">No student orders currently need review.</p></div>}</div>:null}</div>
      <div className="relative"><button onClick={()=>{setProfile(current=>!current);setNotifications(false)}} className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-[#f4f7f9]" aria-label="Open administrator menu"><span className="grid size-9 place-items-center rounded-xl bg-[#0b1f3a] text-xs font-extrabold text-white">AD</span><span className="hidden text-left xl:block"><span className="block max-w-44 truncate text-xs font-bold text-[#0b1f3a]">{email}</span><span className="block text-[11px] text-[#607086]">Super administrator</span></span><ChevronDown size={14} className="hidden text-[#7f8c9a] xl:block"/></button>{profile?<div className="absolute right-0 top-12 w-56 rounded-2xl border border-[#dfe6ec] bg-white p-2 shadow-[0_20px_55px_rgba(11,31,58,.16)]"><Link onClick={()=>setProfile(false)} href="/admin/website-settings" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[#405169] hover:bg-[#f4f7f9]">Account settings</Link><button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-700 hover:bg-red-50"><LogOut size={15}/>Sign out</button></div>:null}</div>
    </div>
  </header>;
}
