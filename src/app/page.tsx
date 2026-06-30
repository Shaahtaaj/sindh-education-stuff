import Link from "next/link";
import { ArrowRight, BookOpenCheck, FileText, GraduationCap } from "lucide-react";
import { Hero } from "@/components/Hero";
import { getPublicMaterials } from "@/lib/public-content";

export const dynamic="force-dynamic";

export default async function Home() {
  const materials=await getPublicMaterials();
  const latest=materials.slice(0,3);

  return <>
    <Hero/>

    <section className="reveal border-b border-[#e5e9ec] bg-white py-14 md:py-18">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#dfe5e9] pb-5">
          <div><h2 className="brand-serif text-3xl font-bold tracking-[-.035em] text-[#0b1f3a] md:text-4xl">Latest resources</h2><p className="mt-2 text-sm leading-6 text-[#607086]">Recently published study material, clearly organised by course.</p></div>
          <Link href="/resources" className="link-arrow inline-flex items-center gap-2 text-sm font-bold text-[#0b6b42]">View all resources <ArrowRight size={17}/></Link>
        </div>

        <div>
          {latest.length?latest.map((item,index)=><article key={item.slug} className="group grid gap-4 border-b border-[#e5e9ec] py-5 transition hover:bg-[#fbfcfc] md:grid-cols-[48px_1fr_auto] md:items-center md:px-2">
            <span className="grid size-11 place-items-center rounded-lg bg-[#edf7f1] text-[#0b6b42]"><FileText size={21}/></span>
            <div><p className="text-xs font-bold uppercase tracking-[.09em] text-[#0b6b42]">{item.courseCode} · {item.category}</p><h3 className="mt-1 text-base font-bold text-[#0b1f3a] md:text-lg"><Link href={`/materials/${item.slug}`}>{item.title}</Link></h3><p className="mt-1 line-clamp-1 text-sm text-[#667589]">{item.description}</p></div>
            <Link href={`/materials/${item.slug}`} className="link-arrow inline-flex items-center gap-2 text-sm font-bold text-[#0b6b42]">View resource <ArrowRight size={16}/></Link>
          </article>):<p className="py-12 text-sm text-[#667589]">No published resources yet.</p>}
        </div>
      </div>
    </section>

    <section className="reveal bg-[#f7f9f8]">
      <div className="container-site grid md:grid-cols-2">
        <div className="flex gap-5 border-b border-[#dfe5e2] py-12 md:border-b-0 md:border-r md:py-16 md:pr-12">
          <span className="grid size-13 shrink-0 place-items-center rounded-full bg-[#e6f3eb] text-[#0b6b42]"><BookOpenCheck size={25}/></span>
          <div><h2 className="brand-serif text-2xl font-bold tracking-[-.025em] text-[#0b1f3a]">Research 8613 guidance</h2><p className="mt-3 max-w-md text-sm leading-7 text-[#607086]">Understand topic selection, proposal structure, research tools and responsible academic practice.</p><Link href="/research-8613" className="link-arrow mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0b6b42]">Explore Research 8613 <ArrowRight size={16}/></Link></div>
        </div>
        <div className="flex gap-5 py-12 md:py-16 md:pl-12">
          <span className="grid size-13 shrink-0 place-items-center rounded-full bg-[#e6f3eb] text-[#0b6b42]"><GraduationCap size={25}/></span>
          <div><h2 className="brand-serif text-2xl font-bold tracking-[-.025em] text-[#0b1f3a]">Need study help?</h2><p className="mt-3 max-w-md text-sm leading-7 text-[#607086]">Get practical support with formatting, teaching practice and presenting your work clearly.</p><Link href="/order-help" className="link-arrow mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0b6b42]">Get study help <ArrowRight size={16}/></Link></div>
        </div>
      </div>
    </section>
  </>;
}
