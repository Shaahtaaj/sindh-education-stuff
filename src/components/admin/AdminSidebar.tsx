"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookMarked, CalendarClock, CalendarDays, CircleDollarSign, FileText, GraduationCap, HelpCircle, LayoutDashboard, LifeBuoy, MessageSquareQuote, Newspaper, SearchCheck, Settings, ShoppingBag } from "lucide-react";
import { Logo } from "../Logo";
import { cn } from "@/lib/utils";

const groups = [
  { label: "Overview", links: [["Dashboard","/admin/dashboard",LayoutDashboard]] },
  { label: "Academic content", links: [["Programs","/admin/programs",GraduationCap],["Courses","/admin/courses",BookMarked],["Semesters","/admin/semesters",CalendarClock],["Materials","/admin/materials",FileText],["Blog Posts","/admin/blog-posts",Newspaper],["Assignment Dates","/admin/assignment-dates",CalendarDays]] },
  { label: "Operations", links: [["Orders","/admin/orders",ShoppingBag],["Payments","/admin/payments",CircleDollarSign],["FAQs","/admin/faqs",HelpCircle],["Testimonials","/admin/testimonials",MessageSquareQuote]] },
  { label: "Configuration", links: [["Website Settings","/admin/website-settings",Settings],["SEO Settings","/admin/seo-settings",SearchCheck],["AdSense Settings","/admin/adsense-settings",BarChart3]] }
] as const;

export function AdminSidebar({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const path = usePathname();
  return <aside className={cn("h-dvh w-[278px] shrink-0 overflow-y-auto border-r border-white/[.06] bg-[#0b1f3a] px-4 py-5 shadow-[8px_0_30px_rgba(5,20,38,.08)]",mobile ? "block" : "sticky top-0 hidden lg:flex lg:flex-col")}>
    <div className="border-b border-white/[.08] px-3 pb-5 pt-1"><Logo inverse/></div>
    <nav className="mt-5 flex-1 space-y-5">
      {groups.map(group => <div key={group.label}>
        <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[.17em]" style={{color:"#91a4bb"}}>{group.label}</p>
        <div className="space-y-1">{group.links.map(([label,href,Icon]) => {
          const active=path===href;
          return <Link onClick={onNavigate} key={href} href={href} aria-current={active?"page":undefined} style={{color:active?"#ffffff":"#d7e0ea",backgroundColor:active?"#147a4b":undefined}} className={cn("group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors hover:bg-white/[.09]",active&&"shadow-[0_8px_22px_rgba(0,0,0,.22)]")}><span className={cn("grid size-8 shrink-0 place-items-center rounded-lg transition-colors",active?"bg-white/[.14]":"bg-transparent group-hover:bg-white/[.08]")}><Icon size={17} style={{color:active?"#ffffff":"#9fb1c5"}}/></span><span className="flex-1" style={{color:active?"#ffffff":"#d7e0ea"}}>{label}</span>{active ? <span className="size-1.5 rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,.12)]"/> : null}</Link>;
        })}</div>
      </div>)}
    </nav>
    <div className="mt-7 rounded-2xl border border-white/10 bg-white/[.055] p-4">
      <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-white/10 text-[#55d393]"><LifeBuoy size={18}/></span><div><p className="text-xs font-bold text-white">Need help?</p><p className="mt-0.5 text-[11px] text-[#9fb0c3]">Admin audit guide</p></div></div>
      <Link onClick={onNavigate} href="/admin/website-settings" className="mt-3 block rounded-lg bg-white/10 px-3 py-2 text-center text-xs font-bold text-white hover:bg-white/15">Review setup</Link>
    </div>
  </aside>;
}
