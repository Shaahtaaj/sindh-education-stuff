import { Breadcrumbs } from "./Breadcrumbs";
export function PageHero({ title, description, breadcrumb }: { title: string; description: string; breadcrumb?: string }) {
  return <section className="bg-[#f4f7f9] py-14 md:py-20"><div className="container-site"><Breadcrumbs items={[{ label: breadcrumb ?? title }]}/><h1 className="mt-7 max-w-4xl text-[clamp(2.5rem,5vw,4.7rem)] font-extrabold leading-[1] tracking-[-.055em] text-[#0b1f3a]">{title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#607086]">{description}</p></div></section>;
}
