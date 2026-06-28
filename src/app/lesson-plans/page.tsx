import { PageHero } from "@/components/PageHero"; import { MaterialListing } from "@/components/MaterialListing";
import { getPublicMaterials } from "@/lib/public-content";
export const metadata={title:"Lesson Plan Formats",description:"Lesson plan formats and teaching practice guidance for AIOU students."};
export const dynamic="force-dynamic";
export default async function Page(){const items=await getPublicMaterials();return <><PageHero title="Lesson plan formats" description="Plan clear objectives, purposeful classroom activities, useful assessment and realistic timings."/><section className="section"><div className="container-site"><MaterialListing items={items} category="Lesson Plans"/></div></section></>}
