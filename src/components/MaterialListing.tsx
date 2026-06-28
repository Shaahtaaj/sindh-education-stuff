"use client";
import { useMemo, useState } from "react";
import type { PublicMaterial } from "@/lib/public-content";
import { MaterialCard } from "./MaterialCard";

export function MaterialListing({ category, items }: { category?: string; items: PublicMaterial[] }) {
  const [query, setQuery] = useState(""); const [program, setProgram] = useState("All"); const [access, setAccess] = useState("All");
  const filtered = useMemo(() => items.filter(x => (!category || x.category === category) && (program === "All" || x.program === program) && (access === "All" || (access === "Free" ? x.isFree : !x.isFree)) && `${x.title} ${x.courseCode} ${x.course} ${x.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [query, program, access, category, items]);
  return <div><div className="grid gap-3 rounded-2xl border border-[#dfe6ec] bg-white p-3 md:grid-cols-[1fr_180px_150px]"><input aria-label="Search materials" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by keyword or course code" className="focus-ring rounded-xl bg-[#f4f7f9] px-4 py-3 text-sm"/><select aria-label="Filter by program" value={program} onChange={e=>setProgram(e.target.value)} className="focus-ring rounded-xl bg-[#f4f7f9] px-4 py-3 text-sm"><option>All</option>{["B.Ed","M.Ed","BA","FA"].map(x=><option key={x}>{x}</option>)}</select><select aria-label="Filter by access" value={access} onChange={e=>setAccess(e.target.value)} className="focus-ring rounded-xl bg-[#f4f7f9] px-4 py-3 text-sm"><option>All</option><option>Free</option><option>Paid</option></select></div><p className="mt-6 text-sm font-semibold text-[#607086]">{filtered.length} resources found</p><div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-3">{filtered.map(x=><MaterialCard key={x.slug} item={x}/>)}</div>{!filtered.length && <div className="py-20 text-center text-[#607086]">No materials match these filters.</div>}</div>;
}
