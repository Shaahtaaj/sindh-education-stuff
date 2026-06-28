import Link from "next/link";
import { ArrowUpRight, Download, LockKeyhole } from "lucide-react";
import type { Material } from "@/data/content";

export function MaterialCard({ item }: { item: Material }) {
  return <article className="group flex h-full flex-col border-t-2 border-[#dfe6ec] pt-5 transition hover:border-[#147a4b]">
    <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[.09em] text-[#607086]"><span>{item.category}</span><span className="text-[#147a4b]">{item.isFree ? "Free" : `PKR ${item.price}`}</span></div>
    <h3 className="mt-4 text-xl font-extrabold leading-7 tracking-[-.02em] text-[#0b1f3a]"><Link href={`/materials/${item.slug}`}>{item.title}</Link></h3>
    <p className="mt-3 flex-1 text-sm leading-6 text-[#607086]">{item.excerpt}</p>
    <div className="mt-5 flex items-center justify-between border-t border-[#e8edf1] pt-4 text-sm"><span className="font-semibold text-[#405169]">{item.courseCode} · {item.program}</span><Link href={`/materials/${item.slug}`} className="focus-ring inline-flex items-center gap-1 rounded-md font-bold text-[#147a4b]">{item.isFree ? <Download size={16}/> : <LockKeyhole size={16}/>} View <ArrowUpRight size={15}/></Link></div>
  </article>;
}
