import { OrderForm } from "@/components/OrderForm"; import { PageHero } from "@/components/PageHero";
export const metadata={title:"Order Study Help",description:"Request responsible academic formatting and study support.",robots:{index:false,follow:true}};
export default function Page(){return <><PageHero title="Order study help" description="Tell us what you are working on, when it is due and what kind of formatting or academic guidance you need."/><section className="section"><div className="container-site max-w-4xl"><OrderForm/></div></section></>}
