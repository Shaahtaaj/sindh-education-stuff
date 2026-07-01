import Link from "next/link";
import { ArrowLeft, CheckCircle2, LockKeyhole } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function PortalAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="portal-auth-shell">
      <aside className="portal-auth-story">
        <Logo inverse />
        <div className="portal-auth-copy">
          <p>One organised workspace</p>
          <h2>From request to delivery, everything stays in one place.</h2>
          <ul>
            <li>
              <CheckCircle2 size={19} /> Track every request clearly
            </li>
            <li>
              <CheckCircle2 size={19} /> Review quotations and payment status
            </li>
            <li>
              <CheckCircle2 size={19} /> Download private delivery files
            </li>
          </ul>
        </div>
        <p className="portal-auth-secure">
          <LockKeyhole size={16} /> Private customer workspace
        </p>
      </aside>
      <main className="portal-auth-main">
        <Link href="/" className="portal-back-link portal-auth-back">
          <ArrowLeft size={16} />
          Back to website
        </Link>
        <div className="portal-auth-card-wrap">{children}</div>
      </main>
    </div>
  );
}
