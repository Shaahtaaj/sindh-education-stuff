"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const links = [
  ["Assignments", "/assignments"], ["Research 8613", "/research-8613"],
  ["Lesson Plans", "/lesson-plans"], ["Resources", "/resources"], ["Blog", "/blog"]
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe6ec] bg-white/95 backdrop-blur">
      <div className="container-site flex h-[74px] items-center justify-between gap-5">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={href} href={href} className="focus-ring rounded-md text-[14px] font-semibold text-[#405169] hover:text-[#147a4b]">{label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/search" className="focus-ring grid size-10 place-items-center rounded-xl border border-[#dfe6ec] text-[#405169]" aria-label="Search"><Search size={18} /></Link>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="focus-ring rounded-xl bg-[#147a4b] px-5 py-3 text-[14px] font-bold text-white hover:bg-[#0d5d39]">WhatsApp us</a>
        </div>
        <button onClick={() => setOpen(!open)} className="focus-ring grid size-11 place-items-center rounded-xl border border-[#dfe6ec] lg:hidden" aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="border-t border-[#dfe6ec] bg-white px-4 py-5 lg:hidden" aria-label="Mobile navigation">
        <div className="container-site grid gap-1">
          {links.map(([label, href]) => <Link key={href} onClick={() => setOpen(false)} href={href} className="rounded-lg px-3 py-3 font-semibold hover:bg-[#eaf6ef]">{label}</Link>)}
          <Link href="/order-help" className="mt-2 rounded-xl bg-[#147a4b] px-4 py-3 text-center font-bold text-white">Order Study Help</Link>
        </div>
      </nav>}
    </header>
  );
}
