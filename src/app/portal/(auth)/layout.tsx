import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function PortalAuthLayout({children}:{children:React.ReactNode}){
  return <div className="min-h-screen bg-[#f5f7f6] p-4 md:p-8"><div className="mx-auto flex max-w-6xl items-center justify-between"><Logo/><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#526277] hover:text-[#0b6b42]"><ArrowLeft size={16}/>Back to website</Link></div><div className="mx-auto grid min-h-[calc(100vh-100px)] max-w-6xl place-items-center py-10">{children}</div></div>;
}
