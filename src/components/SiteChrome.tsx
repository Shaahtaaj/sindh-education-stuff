"use client";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteChrome({children,contactEmail}:{children:React.ReactNode;contactEmail:string}){
  const path=usePathname();
  const admin=path.startsWith("/admin");
  return <>{admin?null:<Header/>}<main>{children}</main>{admin?null:<Footer contactEmail={contactEmail}/>}</>;
}
