import Link from "next/link";
import { BookOpenCheck } from "lucide-react";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-lg" aria-label="Sindh Education Stuff home">
      <span className={`grid size-9 place-items-center rounded-lg ${inverse?"bg-white/10 text-white":"bg-[#edf7f1] text-[#0b6b42]"}`}><BookOpenCheck size={21} strokeWidth={2.1} /></span>
      <span className={`brand-serif text-[18px] font-bold leading-none tracking-[-.025em] ${inverse ? "text-white" : "text-[#0b1f3a]"}`}>Sindh Education Stuff</span>
    </Link>
  );
}
