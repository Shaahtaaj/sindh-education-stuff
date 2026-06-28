import { PageHero } from "@/components/PageHero"; import { MaterialListing } from "@/components/MaterialListing";
export const metadata={title:"Field Notes Samples",description:"Field notes formats, observation prompts and reflective writing guidance."};
export default function Page(){return <><PageHero title="Field notes and observation" description="Record what happened, distinguish observation from interpretation, and write concise professional reflections."/><section className="section"><div className="container-site"><MaterialListing category="Field Notes"/></div></section></>}
