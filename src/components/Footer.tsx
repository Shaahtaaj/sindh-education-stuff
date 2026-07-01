import Link from "next/link";
import { Mail } from "lucide-react";
import { DISCLAIMER } from "@/lib/constants";
import { Logo } from "./Logo";

export function Footer({ contactEmail }: { contactEmail: string }) {
  return <footer className="site-footer">
    <div className="container-site grid items-center gap-7 py-11 md:grid-cols-[1fr_auto]">
      <div><Logo/><p className="mt-3 max-w-md text-sm leading-6 text-[#667589]">Practical resources for AIOU and distance-learning students.</p></div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#405169]"><a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 hover:text-[#0b6b42]"><Mail size={16}/>{contactEmail}</a><Link href="/privacy-policy" className="hover:text-[#0b6b42]">Privacy</Link><Link href="/terms" className="hover:text-[#0b6b42]">Terms</Link><Link href="/contact" className="hover:text-[#0b6b42]">Contact</Link></div>
    </div>
    <div className="border-t border-[#e8ecef]"><div className="container-site py-5 text-xs leading-5 text-[#788697]"><p className="max-w-5xl">{DISCLAIMER}</p></div></div>
  </footer>;
}
