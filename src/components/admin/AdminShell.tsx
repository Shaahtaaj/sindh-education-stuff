"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="flex min-h-screen bg-[#f4f7f9]">
    <AdminSidebar/>
    {menuOpen ? <div className="fixed inset-0 z-50 flex bg-[#071426]/55 backdrop-blur-sm lg:hidden" onMouseDown={event => { if (event.target === event.currentTarget) setMenuOpen(false); }}>
      <div className="relative"><AdminSidebar mobile onNavigate={() => setMenuOpen(false)}/><button onClick={() => setMenuOpen(false)} className="absolute right-3 top-3 grid size-9 place-items-center rounded-lg bg-white/10 text-white" aria-label="Close admin navigation"><X size={18}/></button></div>
    </div> : null}
    <div className="min-w-0 flex-1"><AdminTopbar email={email} onMenu={() => setMenuOpen(true)}/><main className="p-5 md:p-8 lg:p-10">{children}</main></div>
  </div>;
}
