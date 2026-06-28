import { PageHero } from "@/components/PageHero"; import { MaterialListing } from "@/components/MaterialListing";
export const metadata={title:"Assignment Guides",description:"AIOU assignment writing, structure and formatting guidance."};
export default function Page(){return <><PageHero title="Assignment guides" description="Understand the question, plan an original answer and present it with a clear academic structure."/><section className="section"><div className="container-site"><MaterialListing category="Assignments"/></div></section></>}
