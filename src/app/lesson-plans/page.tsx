import { PageHero } from "@/components/PageHero"; import { MaterialListing } from "@/components/MaterialListing";
export const metadata={title:"Lesson Plan Formats",description:"Lesson plan formats and teaching practice guidance for AIOU students."};
export default function Page(){return <><PageHero title="Lesson plan formats" description="Plan clear objectives, purposeful classroom activities, useful assessment and realistic timings."/><section className="section"><div className="container-site"><MaterialListing category="Lesson Plans"/></div></section></>}
