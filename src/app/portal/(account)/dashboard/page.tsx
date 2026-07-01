import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  FilePlus2,
  Files,
  FolderCheck,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { ProgressTimeline } from "@/components/portal/ProgressTimeline";
import { getCustomerSession } from "@/lib/customer-auth";
import { getCustomerOrders } from "@/lib/portal-orders";

export const metadata: Metadata = {
  title: "Customer dashboard",
  robots: { index: false, follow: false },
};

const statusLabel: Record<string, string> = {
  new: "Received",
  waiting_for_payment: "Awaiting payment",
  in_progress: "In progress",
  completed: "Delivered",
  cancelled: "Cancelled",
};

const statusTone: Record<string, string> = {
  new: "status-blue",
  waiting_for_payment: "status-amber",
  in_progress: "status-green",
  completed: "status-green",
  cancelled: "status-neutral",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function CustomerDashboard() {
  const session = await getCustomerSession();
  const orders = session ? await getCustomerOrders(session.id) : [];
  const active = orders.filter(
    (order) => !["completed", "cancelled"].includes(order.orderStatus),
  ).length;
  const delivered = orders.filter(
    (order) => order.orderStatus === "completed",
  ).length;
  const awaiting = orders.filter(
    (order) => order.orderStatus === "waiting_for_payment",
  ).length;
  const currentOrder = orders.find(
    (order) => !["completed", "cancelled"].includes(order.orderStatus),
  );
  const firstName = session?.name.trim().split(/\s+/)[0] || "Student";

  const stats = [
    {
      label: "Active",
      value: active,
      note: active === 1 ? "Request in progress" : "Requests in progress",
      icon: Files,
      tone: "green",
    },
    {
      label: "Awaiting payment",
      value: awaiting,
      note: awaiting ? "Payment required" : "Nothing pending",
      icon: WalletCards,
      tone: "amber",
    },
    {
      label: "Delivered",
      value: delivered,
      note: delivered ? "Ready to download" : "No deliveries yet",
      icon: FolderCheck,
      tone: "mint",
    },
  ];

  return (
    <div className="portal-page portal-enter">
      <div className="portal-page-heading">
        <div>
          <h1>Good morning, {firstName}</h1>
          <p>Here&apos;s what&apos;s happening with your requests.</p>
        </div>
        <Link href="/portal/requests/new" className="portal-primary-button">
          <FilePlus2 size={18} />
          New request
        </Link>
      </div>

      <div className="portal-stat-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className={`portal-stat portal-stagger-${index + 1}`}
              data-tone={stat.tone}
            >
              <span className="portal-stat-icon">
                <Icon size={23} strokeWidth={1.8} />
              </span>
              <div>
                <p className="portal-stat-label">{stat.label}</p>
                <strong>{stat.value}</strong>
                <p className="portal-stat-note">{stat.note}</p>
              </div>
            </article>
          );
        })}
      </div>

      {currentOrder ? (
        <section className="portal-panel portal-current-request">
          <div className="portal-panel-heading">
            <div>
              <p className="portal-overline">Current request</p>
              <h2>
                {currentOrder.courseCode} · {currentOrder.serviceType}
              </h2>
            </div>
            <Link
              href={`/portal/requests/${currentOrder.id}`}
              className="portal-text-link"
            >
              View details <ArrowRight size={16} />
            </Link>
          </div>
          <ProgressTimeline status={currentOrder.orderStatus} />
          <div className="portal-current-meta">
            <span>
              <Clock3 size={15} /> Submitted {formatDate(currentOrder.createdAt)}
            </span>
            <span className={`portal-status ${statusTone[currentOrder.orderStatus]}`}>
              {statusLabel[currentOrder.orderStatus]}
            </span>
          </div>
        </section>
      ) : null}

      <section className="portal-panel portal-recent">
        <div className="portal-panel-heading">
          <div>
            <p className="portal-overline">Your workspace</p>
            <h2>Recent requests</h2>
          </div>
          <span className="portal-total">{orders.length} total</span>
        </div>

        {orders.length ? (
          <div className="portal-table-wrap">
            <div className="portal-table-head">
              <span>Reference</span>
              <span>Course</span>
              <span>Service</span>
              <span>Date</span>
              <span>Status</span>
              <span aria-hidden="true" />
            </div>
            {orders.slice(0, 8).map((order) => (
              <Link
                key={order.id}
                href={`/portal/requests/${order.id}`}
                className="portal-table-row"
              >
                <strong>SES-{order.reference}</strong>
                <span>{order.courseCode}</span>
                <span>{order.serviceType}</span>
                <span>{formatDate(order.createdAt)}</span>
                <span>
                  <span className={`portal-status ${statusTone[order.orderStatus]}`}>
                    {statusLabel[order.orderStatus] ?? order.orderStatus}
                  </span>
                </span>
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="portal-empty">
            <span>
              <FilePlus2 size={24} />
            </span>
            <h3>No requests yet</h3>
            <p>Create your first support request when you are ready.</p>
            <Link href="/portal/requests/new" className="portal-primary-button">
              Start a request
            </Link>
          </div>
        )}
      </section>

      <p className="portal-privacy">
        <ShieldCheck size={17} />
        Your account data and delivered files are private and secure.
      </p>
    </div>
  );
}
