import { Info } from "lucide-react";
import { DISCLAIMER } from "@/lib/constants";
export function DisclaimerBar() { return <div className="border-y border-[#cfe6d8] bg-[#eaf6ef]"><div className="container-site flex gap-3 py-3 text-xs leading-5 text-[#315b46]"><Info size={17} className="mt-0.5 shrink-0"/><p>{DISCLAIMER}</p></div></div>; }
