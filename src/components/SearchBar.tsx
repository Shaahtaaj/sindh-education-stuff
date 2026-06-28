"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const submit = (e: FormEvent) => { e.preventDefault(); if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`); };
  return <form onSubmit={submit} role="search" className={`flex items-center gap-2 border border-[#d4dde5] bg-white p-2 shadow-[0_16px_45px_rgba(11,31,58,.1)] ${compact ? "rounded-xl" : "rounded-2xl"}`}>
    <Search className="ml-2 shrink-0 text-[#607086]" size={20}/>
    <label className="sr-only" htmlFor={compact ? "compact-search" : "hero-search"}>Search study materials</label>
    <input id={compact ? "compact-search" : "hero-search"} value={query} onChange={e => setQuery(e.target.value)} className="focus-ring min-w-0 flex-1 px-2 py-2.5 text-[15px] text-[#132238] placeholder:text-[#8390a0]" placeholder="Course code, course name, category or keyword" />
    <button className="focus-ring rounded-xl bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-white hover:bg-[#17365f]">Search</button>
  </form>;
}
