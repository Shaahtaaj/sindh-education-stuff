import { FAQAccordion } from "@/components/FAQAccordion"; import { PageHero } from "@/components/PageHero"; import { faqs } from "@/data/content";
export const metadata={title:"Frequently Asked Questions",description:"Answers about resources, orders and independent academic support."};
export default function Page(){return <><PageHero title="Frequently asked questions" description="Straight answers about our role, responsible use, resources, files and orders."/><section className="section"><div className="container-site max-w-4xl"><FAQAccordion items={faqs}/></div></section></>}
