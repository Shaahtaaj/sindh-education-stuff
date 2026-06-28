"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState(0);
  return <div className="divide-y divide-[#dfe6ec] border-y border-[#dfe6ec]">{items.map((item, i) => <div key={item.question}>
    <button onClick={() => setOpen(open === i ? -1 : i)} className="focus-ring flex w-full items-center justify-between gap-5 py-6 text-left text-base font-extrabold text-[#0b1f3a]" aria-expanded={open === i}>{item.question}<ChevronDown size={20} className={`shrink-0 transition ${open === i ? "rotate-180 text-[#147a4b]" : ""}`}/></button>
    {open === i && <p className="max-w-3xl pb-6 pr-10 text-[15px] leading-7 text-[#607086]">{item.answer}</p>}
  </div>)}</div>;
}
