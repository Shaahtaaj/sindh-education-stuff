import Link from "next/link";
import { BookOpen, BookOpenCheck, CalendarDays, FileText, Lightbulb, Newspaper, NotebookPen, Search, Users, type LucideIcon } from "lucide-react";

type Props = { title: string; href: string; icon: string; description: string; index: number };
const icons: Record<string, LucideIcon> = { FileText, Search, BookOpen, BookOpenCheck, NotebookPen, Lightbulb, CalendarDays, Users, Newspaper };
export function CategoryCard({ title, href, icon, description, index }: Props) {
  const Icon = icons[icon] ?? BookOpen;
  return <Link href={href} className="group grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-[#dfe6ec] py-6 transition hover:border-[#147a4b]">
    <span className="grid size-11 place-items-center rounded-xl bg-[#eaf6ef] text-[#147a4b]"><Icon size={21} strokeWidth={2}/></span>
    <span><span className="block text-lg font-extrabold text-[#0b1f3a]">{title}</span><span className="mt-1 block text-sm leading-6 text-[#607086]">{description}</span></span>
    <span className="pt-2 text-xs font-bold text-[#9aa5b2]">0{index + 1}</span>
  </Link>;
}
