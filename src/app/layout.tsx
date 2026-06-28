import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | AIOU Study Guidance`, template: `%s | ${SITE_NAME}` },
  description: "Independent AIOU study guidance, Research 8613 support, lesson-plan formats, field notes, guess papers and academic formatting help.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE_NAME, title: SITE_NAME, description: "Responsible study guidance and teaching-practice support for AIOU students.", url: SITE_URL },
  twitter: { card: "summary_large_image" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><SiteChrome contactEmail={CONTACT_EMAIL}>{children}</SiteChrome></body></html>;
}
