import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";

export default async function PortalPage(){
  redirect(await getCustomerSession()?"/portal/dashboard":"/portal/login");
}
