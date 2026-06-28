import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-[#607086]"><Link href="/" className="hover:text-[#147a4b]">Home</Link>{items.map(item => <span key={item.label} className="flex items-center gap-2"><ChevronRight size={14}/>{item.href ? <Link href={item.href}>{item.label}</Link> : <span className="font-semibold text-[#0b1f3a]">{item.label}</span>}</span>)}</nav>;
}
