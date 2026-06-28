import { PageHero } from "@/components/PageHero"; import { MaterialListing } from "@/components/MaterialListing";
import { getPublicMaterials } from "@/lib/public-content";
type Props={params:Promise<{code:string}>}; export async function generateMetadata({params}:Props){const {code}=await params;return {title:`Course ${code}`,description:`Study resources and guidance for AIOU course ${code}.`}}
export const dynamic="force-dynamic";
export default async function Page({params}:Props){const {code}=await params;const items=(await getPublicMaterials()).filter(item=>item.courseCode===code);return <><PageHero title={`Course ${code}`} description={`Browse current study guidance, templates and academic-support resources associated with AIOU course ${code}.`}/><section className="section"><div className="container-site"><MaterialListing items={items}/></div></section></>}
