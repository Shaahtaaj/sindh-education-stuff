import { Search } from "lucide-react";

export function Hero() {
  return <section className="hero-surface overflow-hidden border-b border-[#e5e9ec]">
    <div className="container-site flex min-h-[500px] items-center py-16 lg:py-20">
      <div className="reveal max-w-4xl">
        <h1 className="brand-serif text-[clamp(2.65rem,6.2vw,5.8rem)] font-bold leading-[.96] tracking-[-.045em] text-[#0b1f3a]">Clear study resources.<br/><span className="text-[#0b6b42]">Better learning.</span></h1>
        <p className="mt-7 max-w-2xl text-[clamp(1rem,1.4vw,1.16rem)] leading-8 text-[#526277]">Practical assignments, research guidance and teaching resources for distance-learning students.</p>
        <form action="/search" className="mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <label className="focus-within:ring-3 focus-within:ring-[#0b6b42]/15 flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-[#d8e0e5] bg-white px-4 shadow-[0_4px_18px_rgba(11,31,58,.04)]"><Search size={19} className="shrink-0 text-[#7b8999]"/><span className="sr-only">Search resources</span><input name="q" placeholder="Search assignments, guides and resources…" className="h-13 min-w-0 flex-1 bg-transparent text-sm text-[#0b1f3a] outline-none placeholder:text-[#8794a3]"/></label>
          <button className="focus-ring rounded-lg bg-[#0b6b42] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#075332] active:translate-y-0">Find resources</button>
        </form>
      </div>
    </div>
  </section>;
}
