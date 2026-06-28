import { PageHero } from "@/components/PageHero"; import { MaterialListing } from "@/components/MaterialListing";
import { getPublicMaterials } from "@/lib/public-content";
export const metadata={title:"Field Notes Samples",description:"Field notes formats, observation prompts and reflective writing guidance."};
export const dynamic="force-dynamic";
export default async function Page(){const items=await getPublicMaterials();return <><PageHero title="Field notes and observation" description="Record what happened, distinguish observation from interpretation, and write concise professional reflections."/><section className="section"><div className="container-site"><MaterialListing items={items} category="Field Notes"/></div></section></>}
