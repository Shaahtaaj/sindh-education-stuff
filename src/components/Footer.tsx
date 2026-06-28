import Link from "next/link";
import { Globe2, Mail, MapPin, Play } from "lucide-react";
import { DISCLAIMER } from "@/lib/constants";
import { Logo } from "./Logo";

const columns = [
  { title: "Study support", links: [["Assignments", "/assignments"], ["Research 8613", "/research-8613"], ["Lesson Plans", "/lesson-plans"], ["Field Notes", "/field-notes"], ["Guess Papers", "/guess-papers"]] },
  { title: "Information", links: [["About us", "/about"], ["Contact us", "/contact"], ["FAQs", "/faqs"], ["Tutor Guide", "/tutor-guide"], ["Assignment Dates", "/assignment-dates"]] },
  { title: "Policies", links: [["Privacy Policy", "/privacy-policy"], ["Terms & Conditions", "/terms"], ["Disclaimer", "/disclaimer"], ["DMCA / Copyright", "/dmca"]] }
];

export function Footer({ contactEmail }: { contactEmail: string }) {
  return <footer className="bg-[#0b1f3a] text-white">
    <div className="container-site grid gap-12 py-16 md:grid-cols-[1.2fr_repeat(3,.75fr)]">
      <div><Logo inverse /><p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">Practical study guidance, clear formats and responsible academic support for distance-learning students.</p>
        <div className="mt-5 flex gap-3"><a className="grid size-9 place-items-center rounded-lg bg-white/10" href="#" aria-label="Social profile"><Globe2 size={17}/></a><a className="grid size-9 place-items-center rounded-lg bg-white/10" href="#" aria-label="Video channel"><Play size={17}/></a></div>
      </div>
      {columns.map(col => <div key={col.title}><h2 className="mb-4 text-sm font-bold uppercase tracking-[.12em] text-white">{col.title}</h2><ul className="space-y-3">{col.links.map(([label, href]) => <li key={href}><Link className="text-sm text-slate-300 hover:text-white" href={href}>{label}</Link></li>)}</ul></div>)}
    </div>
    <div className="border-t border-white/10"><div className="container-site grid gap-5 py-7 text-xs leading-6 text-slate-400 md:grid-cols-[1fr_auto]"><p>{DISCLAIMER}</p><div className="space-y-1 md:text-right"><p className="flex items-center gap-2 md:justify-end"><Mail size={14}/>{contactEmail}</p><p className="flex items-center gap-2 md:justify-end"><MapPin size={14}/>Sindh, Pakistan</p></div></div></div>
  </footer>;
}
