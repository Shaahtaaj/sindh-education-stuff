"use client";
import { usePathname } from "next/navigation";
import { Header } from "./Header"; import { Footer } from "./Footer"; import { WhatsAppButton } from "./WhatsAppButton"; import { DisclaimerBar } from "./DisclaimerBar";
export function SiteChrome({children,contactEmail}:{children:React.ReactNode;contactEmail:string}){const path=usePathname();const admin=path.startsWith("/admin");return <>{!admin&&<><Header/><DisclaimerBar/></>}<main>{children}</main>{!admin&&<><Footer contactEmail={contactEmail}/><WhatsAppButton/></>}</>}
