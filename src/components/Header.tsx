"use client";

import Link from "next/link";
import { Menu, MessageCircle, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const links = [
  ["Home", "/"], ["Assignments", "/assignments"], ["Research 8613", "/research-8613"],
  ["Resources", "/resources"], ["Contact", "/contact"]
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname=usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-[#e3e8ec] bg-white/94 backdrop-blur-xl">
      <div className="container-site flex h-[72px] items-center justify-between gap-5">
        <Logo />
        <nav className="hidden h-full items-center gap-8 lg:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => {const active=href==="/"?pathname==="/":pathname.startsWith(href);return <Link key={href} href={href} className={`nav-link focus-ring relative flex h-full items-center rounded-sm text-[14px] font-semibold ${active?"text-[#0b6b42]":"text-[#26374d] hover:text-[#0b6b42]"}`}>{label}{active?<span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#0b6b42]"/>:null}</Link>})}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/search" className="focus-ring grid size-10 place-items-center rounded-full text-[#26374d] transition hover:bg-[#f1f5f3] hover:text-[#0b6b42]" aria-label="Search"><Search size={19} /></Link>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#0b6b42] px-4 py-2.5 text-[14px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#075332]"><MessageCircle size={17}/>WhatsApp</a>
        </div>
        <button onClick={() => setOpen(!open)} className="focus-ring grid size-10 place-items-center rounded-lg border border-[#dfe6ec] text-[#0b1f3a] lg:hidden" aria-label="Toggle menu" aria-expanded={open}>{open ? <X size={20}/> : <Menu size={20}/>}</button>
      </div>
      {open ? <nav className="mobile-menu border-t border-[#e3e8ec] bg-white px-4 py-4 shadow-[0_18px_35px_rgba(11,31,58,.08)] lg:hidden" aria-label="Mobile navigation">
        <div className="container-site grid gap-1">
          {links.map(([label, href]) => <Link key={href} onClick={() => setOpen(false)} href={href} className="rounded-lg px-3 py-3 text-sm font-semibold text-[#26374d] transition hover:bg-[#edf7f1] hover:text-[#0b6b42]">{label}</Link>)}
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b6b42] px-4 py-3 text-sm font-bold text-white"><MessageCircle size={17}/>WhatsApp</a>
        </div>
      </nav>:null}
    </header>
  );
}
