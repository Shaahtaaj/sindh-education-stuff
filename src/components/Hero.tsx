import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Download } from "lucide-react";
import { SearchBar } from "./SearchBar";

export function Hero() {
  return <section className="overflow-hidden bg-white">
    <div className="container-site grid min-h-[650px] items-center gap-12 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
      <div>
        <h1 className="max-w-3xl text-[clamp(2.65rem,5.3vw,4.7rem)] font-extrabold leading-[.98] tracking-[-.055em] text-[#0b1f3a]">AIOU Study Guidance, Research Help & Teaching Practice Support</h1>
        <p className="mt-6 max-w-2xl text-[clamp(1rem,1.5vw,1.2rem)] leading-8 text-[#607086]">Find assignment guides, Research 8613 support, lesson plan formats, field notes samples, guess papers, and academic formatting help in one place.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/resources" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-[#147a4b] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#0d5d39]"><Download size={18}/>Explore Free Material</Link>
          <Link href="/order-help" className="focus-ring inline-flex items-center gap-2 rounded-xl border border-[#0b1f3a] px-5 py-3.5 text-sm font-bold text-[#0b1f3a] hover:bg-[#f4f7f9]">Order Study Help<ArrowRight size={18}/></Link>
          <Link href="/assignment-dates" className="focus-ring inline-flex items-center gap-2 px-2 py-3.5 text-sm font-bold text-[#405169]"><CalendarDays size={18}/>Check Assignment Dates</Link>
        </div>
        <div className="mt-9 max-w-2xl"><SearchBar /></div>
      </div>
      <div className="relative">
        <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-[#eaf6ef]"/>
        <Image priority src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85" alt="University students studying together with notebooks and a laptop" width={1000} height={900} className="aspect-[4/4.3] w-full rounded-[2rem] object-cover shadow-[0_30px_80px_rgba(11,31,58,.15)]" />
        <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-white/60 bg-white/95 p-5 shadow-xl backdrop-blur sm:left-8 sm:right-auto sm:max-w-xs"><p className="text-xs font-bold uppercase tracking-[.12em] text-[#147a4b]">Responsible support</p><p className="mt-2 text-sm font-semibold leading-6 text-[#0b1f3a]">Guidance that helps you understand, structure and produce your own original work.</p></div>
      </div>
    </div>
  </section>;
}
