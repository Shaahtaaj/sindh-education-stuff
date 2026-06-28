import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function BlogCard({ post }: { post: { title: string; slug: string; category: string; excerpt: string; date: string; readTime: string } }) {
  return <article className="border-b border-[#dfe6ec] py-7 first:pt-0">
    <div className="text-xs font-bold uppercase tracking-[.1em] text-[#147a4b]">{post.category} · {formatDate(post.date)} · {post.readTime}</div>
    <h3 className="mt-3 text-[clamp(1.4rem,2.3vw,2rem)] font-extrabold tracking-[-.035em] text-[#0b1f3a]"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
    <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#607086]">{post.excerpt}</p>
    <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#147a4b]">Read article <ArrowRight size={16}/></Link>
  </article>;
}
