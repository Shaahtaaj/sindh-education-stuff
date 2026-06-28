import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function WhatsAppButton() {
  return <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Assalam-o-Alaikum, I need study guidance.")}`} target="_blank" rel="noreferrer" className="focus-ring fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#147a4b] px-4 py-3 font-bold text-white shadow-[0_10px_30px_rgba(20,122,75,.3)] hover:bg-[#0d5d39]" aria-label="Contact us on WhatsApp"><MessageCircle size={21}/><span className="hidden sm:inline">WhatsApp</span></a>;
}
