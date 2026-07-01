"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FilePlus2, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";

const links=[
  {href:"/portal/dashboard",label:"Dashboard",icon:LayoutDashboard},
  {href:"/portal/requests/new",label:"New request",icon:FilePlus2}
];

export function PortalShell({name,children}:{name:string;children:React.ReactNode}){
  const pathname=usePathname();const router=useRouter();const [open,setOpen]=useState(false);
  async function logout(){await fetch("/api/portal/auth/logout",{method:"POST"});router.push("/portal/login");router.refresh()}
  const navigation=<nav className="grid gap-1" aria-label="Customer portal">{links.map(item=>{const Icon=item.icon;const active=pathname===item.href;return <Link key={item.href} href={item.href} onClick={()=>setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${active?"bg-[#e8f4ed] text-[#0b6b42]":"text-[#526277] hover:bg-[#f3f6f5] hover:text-[#0b1f3a]"}`}><Icon size={18}/>{item.label}</Link>})}</nav>;
  return <div className="min-h-screen bg-[#f5f7f6]">
    <header className="sticky top-0 z-40 border-b border-[#dfe5e2] bg-white/95 backdrop-blur"><div className="mx-auto flex h-17 max-w-[1400px] items-center justify-between px-4 md:px-6"><Logo/><div className="flex items-center gap-3"><span className="hidden text-sm font-semibold text-[#526277] sm:block">{name}</span><button onClick={()=>setOpen(!open)} className="grid size-10 place-items-center rounded-xl border border-[#d7e0e7] text-[#0b1f3a] lg:hidden" aria-label="Toggle portal menu">{open?<X size={19}/>:<Menu size={19}/>}</button></div></div></header>
    {open?<div className="border-b border-[#dfe5e2] bg-white p-4 lg:hidden">{navigation}<button onClick={logout} className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#8a4545]"><LogOut size={18}/>Sign out</button></div>:null}
    <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[230px_1fr]">
      <aside className="hidden min-h-[calc(100vh-68px)] border-r border-[#dfe5e2] bg-white p-5 lg:flex lg:flex-col">{navigation}<button onClick={logout} className="mt-auto flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#8a4545] transition hover:bg-red-50"><LogOut size={18}/>Sign out</button></aside>
      <div className="min-w-0 p-4 md:p-8 lg:p-10">{children}</div>
    </div>
  </div>;
}
