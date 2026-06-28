import { PageHero } from "@/components/PageHero"; import { MaterialListing } from "@/components/MaterialListing";
export const metadata={title:"Search",robots:{index:false,follow:true}};
export default function Page(){return <><PageHero title="Search resources" description="Find material by course code, course name, category or keyword."/><section className="section"><div className="container-site"><MaterialListing/></div></section></>}
