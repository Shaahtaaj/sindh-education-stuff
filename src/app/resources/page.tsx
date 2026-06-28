import { PageHero } from "@/components/PageHero";
import { MaterialListing } from "@/components/MaterialListing";
import { getPublicMaterials } from "@/lib/public-content";
export const metadata = { title: "Study Resources", description: "Browse free and paid AIOU study support resources by course, program and category." };
export const dynamic="force-dynamic";
export default async function Page(){const items=await getPublicMaterials();return <><PageHero title="Study resources" description="Search practical guides, templates and course-specific learning support. Free and paid resources are always clearly identified."/><section className="section"><div className="container-site"><MaterialListing items={items}/></div></section></>}
