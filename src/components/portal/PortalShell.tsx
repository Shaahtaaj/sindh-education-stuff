"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/requests/new", label: "New request", icon: FilePlus2 },
];

export function PortalShell({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "S";

  async function logout() {
    await fetch("/api/portal/auth/logout", { method: "POST" });
    router.push("/portal/login");
    router.refresh();
  }

  const navigation = (
    <nav className="grid gap-2" aria-label="Customer portal">
      {links.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href ||
          (item.href !== "/portal/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`portal-nav-link ${active ? "is-active" : ""}`}
          >
            <Icon size={19} strokeWidth={1.9} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="portal-app min-h-screen">
      <aside className="portal-sidebar hidden lg:flex">
        <div className="px-5 py-7">
          <Logo inverse />
        </div>
        <div className="mt-7 px-3">{navigation}</div>
        <div className="mt-auto px-4 pb-5">
          <div className="mb-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#0b8f58] text-sm font-bold text-white">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{name}</p>
              <p className="text-xs text-white/55">Student account</p>
            </div>
            <ChevronDown size={15} className="text-white/50" />
          </div>
          <button onClick={logout} className="portal-signout">
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-[248px]">
        <header className="portal-topbar">
          <div className="flex items-center gap-3 lg:hidden">
            <Logo />
          </div>
          <div className="hidden items-center text-sm font-semibold text-[#627083] lg:flex">
            Customer workspace
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              className="portal-icon-button hidden sm:grid"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-[#0b8f58]" />
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="portal-icon-button lg:hidden"
              aria-label="Toggle portal menu"
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {open ? (
          <div className="portal-mobile-menu lg:hidden">
            {navigation}
            <button onClick={logout} className="portal-mobile-signout">
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        ) : null}

        <main className="portal-main">{children}</main>
      </div>
    </div>
  );
}
