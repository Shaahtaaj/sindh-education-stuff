import { PageHero } from "@/components/PageHero"; import { MaterialListing } from "@/components/MaterialListing";
import { getPublicMaterials } from "@/lib/public-content";
export const metadata={title:"Search",robots:{index:false,follow:true}};
export const dynamic="force-dynamic";
export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}){const [{q},items]=await Promise.all([searchParams,getPublicMaterials()]);return <><PageHero title="Search resources" description="Find material by course code, course name, category or keyword."/><section className="section"><div className="container-site"><MaterialListing items={items} initialQuery={(q??"").slice(0,80)}/></div></section></>}
