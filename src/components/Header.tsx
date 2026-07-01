"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, MessageCircle, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const links = [
  ["Home", "/"],
  ["Assignments", "/assignments"],
  ["Research 8613", "/research-8613"],
  ["Resources", "/resources"],
  ["Contact", "/contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container-site flex h-[78px] items-center justify-between gap-5">
        <Logo />
        <nav className="hidden h-full items-center gap-8 lg:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`site-nav-link ${active ? "is-active" : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/search" className="site-icon-link" aria-label="Search">
            <Search size={19} />
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="site-icon-link"
            aria-label="Contact on WhatsApp"
          >
            <MessageCircle size={19} />
          </a>
          <Link href="/portal" className="site-portal-link">
            Customer portal <ArrowUpRight size={16} />
          </Link>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="site-menu-button lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open ? (
        <nav className="site-mobile-menu lg:hidden" aria-label="Mobile navigation">
          <div className="container-site grid gap-1">
            {links.map(([label, href]) => (
              <Link key={href} onClick={() => setOpen(false)} href={href}>
                {label}
              </Link>
            ))}
            <Link
              href="/portal"
              onClick={() => setOpen(false)}
              className="site-portal-link mt-3"
            >
              Customer portal <ArrowUpRight size={16} />
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
