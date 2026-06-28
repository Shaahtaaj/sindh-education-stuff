import { PageHero } from "@/components/PageHero";
import { MaterialListing } from "@/components/MaterialListing";
export const metadata = { title: "Study Resources", description: "Browse free and paid AIOU study support resources by course, program and category." };
export default function Page(){return <><PageHero title="Study resources" description="Search practical guides, templates and course-specific learning support. Free and paid resources are always clearly identified."/><section className="section"><div className="container-site"><MaterialListing/></div></section></>}
