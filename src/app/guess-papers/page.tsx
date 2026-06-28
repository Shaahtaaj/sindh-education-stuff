import { PageHero } from "@/components/PageHero"; import { MaterialListing } from "@/components/MaterialListing";
export const metadata={title:"Guess Papers",description:"Focused revision and exam-preparation guides for AIOU courses."};
export default function Page(){return <><PageHero title="Guess papers and exam preparation" description="Use topic-focused prompts to revise course outcomes. These are study aids, not guaranteed exam questions."/><section className="section"><div className="container-site"><MaterialListing category="Guess Papers"/></div></section></>}
