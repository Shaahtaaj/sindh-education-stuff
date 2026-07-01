import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { getCustomerSession } from "@/lib/customer-auth";

export default async function CustomerAccountLayout({children}:{children:React.ReactNode}){
  const session=await getCustomerSession();
  if(!session)redirect("/portal/login");
  return <PortalShell name={session.name}>{children}</PortalShell>;
}
