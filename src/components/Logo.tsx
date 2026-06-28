import Link from "next/link";
import { BookOpenCheck } from "lucide-react";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg" aria-label="Sindh Education Stuff home">
      <span className="grid size-10 place-items-center rounded-xl bg-[#147a4b] text-white"><BookOpenCheck size={22} strokeWidth={2.2} /></span>
      <span className={`text-[15px] font-extrabold leading-tight tracking-[-.02em] ${inverse ? "text-white" : "text-[#0b1f3a]"}`}>Sindh Education<br />Stuff</span>
    </Link>
  );
}
