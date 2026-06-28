import { PageHero } from "@/components/PageHero"; import { MaterialListing } from "@/components/MaterialListing";
import { getPublicMaterials } from "@/lib/public-content";
export const metadata={title:"Guess Papers",description:"Focused revision and exam-preparation guides for AIOU courses."};
export const dynamic="force-dynamic";
export default async function Page(){const items=await getPublicMaterials();return <><PageHero title="Guess papers and exam preparation" description="Use topic-focused prompts to revise course outcomes. These are study aids, not guaranteed exam questions."/><section className="section"><div className="container-site"><MaterialListing items={items} category="Guess Papers"/></div></section></>}
