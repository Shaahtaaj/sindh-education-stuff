import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Download, LockKeyhole } from "lucide-react";
import type { PublicMaterial } from "@/lib/public-content";

export function MaterialCard({ item }: { item: PublicMaterial }) {
  return <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#dfe6ec] bg-white transition hover:border-[#92bda3] hover:shadow-[0_12px_35px_rgba(11,31,58,.08)]">
    {item.thumbnailUrl?<Link href={`/materials/${item.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-[#eaf6ef]"><Image src={item.thumbnailUrl} alt={`${item.title} thumbnail`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-300 group-hover:scale-[1.02]"/></Link>:<div className="aspect-[16/9] bg-gradient-to-br from-[#eaf6ef] to-[#dceaf4]"/>}
    <div className="flex flex-1 flex-col p-5">
    <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[.09em] text-[#607086]"><span>{item.category}</span><span className="text-[#147a4b]">{item.isFree ? "Free" : `PKR ${item.price}`}</span></div>
    <h3 className="mt-4 text-xl font-extrabold leading-7 tracking-[-.02em] text-[#0b1f3a]"><Link href={`/materials/${item.slug}`}>{item.title}</Link></h3>
    <p className="mt-3 flex-1 text-sm leading-6 text-[#607086]">{item.description}</p>
    <div className="mt-5 flex items-center justify-between border-t border-[#e8edf1] pt-4 text-sm"><span className="font-semibold text-[#405169]">{item.courseCode} · {item.program}</span><Link href={`/materials/${item.slug}`} className="focus-ring inline-flex items-center gap-1 rounded-md font-bold text-[#147a4b]">{item.isFree ? <Download size={16}/> : <LockKeyhole size={16}/>} View <ArrowUpRight size={15}/></Link></div>
    </div>
  </article>;
}
