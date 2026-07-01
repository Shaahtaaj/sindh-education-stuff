"use client";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteChrome({children,contactEmail}:{children:React.ReactNode;contactEmail:string}){
  const path=usePathname();
  const appSurface=path.startsWith("/admin")||path.startsWith("/portal");
  return <>{appSurface?null:<Header/>}<main>{children}</main>{appSurface?null:<Footer contactEmail={contactEmail}/>}</>;
}
