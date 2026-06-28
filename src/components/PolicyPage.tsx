import { PageHero } from "./PageHero";
export type Section={heading:string;body:string};
export function PolicyPage({title,description,sections}:{title:string;description:string;sections:Section[]}){return <><PageHero title={title} description={description}/><section className="section"><div className="container-site max-w-4xl rich-content">{sections.map(x=><section key={x.heading}><h2>{x.heading}</h2><p>{x.body}</p></section>)}</div></section></>}
