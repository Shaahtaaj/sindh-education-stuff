import { PageHero } from "@/components/PageHero"; import { MaterialListing } from "@/components/MaterialListing";
import { getPublicMaterials } from "@/lib/public-content";
export const metadata={title:"Assignment Guides",description:"AIOU assignment writing, structure and formatting guidance."};
export const dynamic="force-dynamic";
export default async function Page(){const items=await getPublicMaterials();return <><PageHero title="Assignment guides" description="Understand the question, plan an original answer and present it with a clear academic structure."/><section className="section"><div className="container-site"><MaterialListing items={items} category="Assignments"/></div></section></>}
