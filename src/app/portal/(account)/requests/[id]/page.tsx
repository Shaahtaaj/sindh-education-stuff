import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Download,
  FileText,
  LockKeyhole,
  WalletCards,
} from "lucide-react";
import { ProgressTimeline } from "@/components/portal/ProgressTimeline";
import { getCustomerSession } from "@/lib/customer-auth";
import { getCustomerOrder } from "@/lib/portal-orders";

export const metadata: Metadata = {
  title: "Request details",
  robots: { index: false, follow: false },
};

const statusLabel: Record<string, string> = {
  new: "Received",
  waiting_for_payment: "Awaiting payment",
  in_progress: "In progress",
  completed: "Delivered",
  cancelled: "Cancelled",
};

export default async function RequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCustomerSession();
  const { id } = await params;
  const order = session ? await getCustomerOrder(session.id, id) : null;
  if (!order) notFound();

  return (
    <div className="portal-page portal-enter mx-auto max-w-6xl">
      <Link href="/portal/dashboard" className="portal-back-link">
        <ArrowLeft size={16} />
        Back to requests
      </Link>

      <div className="portal-detail-title">
        <div>
          <p>SES-{order.reference}</p>
          <h1>
            {order.courseCode} · {order.serviceType}
          </h1>
          <span>
            Submitted{" "}
            {new Date(order.createdAt).toLocaleDateString("en-PK", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="text-right">
          <span className="portal-status status-green">
            {statusLabel[order.orderStatus] ?? order.orderStatus}
          </span>
          <p className="mt-2 text-xs text-[#7b8797]">
            Updated{" "}
            {new Date(order.updatedAt).toLocaleDateString("en-PK", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <section className="portal-panel portal-detail-progress">
        <div className="portal-panel-heading">
          <div>
            <p className="portal-overline">Live status</p>
            <h2>Request progress</h2>
          </div>
        </div>
        <ProgressTimeline status={order.orderStatus} />
      </section>

      <div className="portal-detail-grid">
        <section className="portal-panel portal-detail-info">
          <div className="portal-panel-heading">
            <div>
              <p className="portal-overline">Submitted information</p>
              <h2>Request details</h2>
            </div>
            <FileText size={20} className="text-[#0b8f58]" />
          </div>
          <dl>
            <div>
              <dt>Reference</dt>
              <dd>SES-{order.reference}</dd>
            </div>
            <div>
              <dt>Program</dt>
              <dd>{order.program}</dd>
            </div>
            <div>
              <dt>Course code</dt>
              <dd>{order.courseCode}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>{order.serviceType}</dd>
            </div>
            <div>
              <dt>Deadline</dt>
              <dd>
                <CalendarDays size={15} />
                {new Date(order.deadline).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
            <div className="portal-detail-message">
              <dt>Instructions</dt>
              <dd>{order.message}</dd>
            </div>
          </dl>
        </section>

        <aside className="grid content-start gap-5">
          <section className="portal-panel portal-payment-card">
            <div className="portal-panel-heading">
              <div>
                <p className="portal-overline">Quotation</p>
                <h2>Payment</h2>
              </div>
              <WalletCards size={20} className="text-[#0b8f58]" />
            </div>
            <div className="portal-price-row">
              <span>Total</span>
              <strong>
                {order.price
                  ? `PKR ${order.price.toLocaleString()}`
                  : "Pending quote"}
              </strong>
            </div>
            <p className="portal-payment-state">
              Status: {order.paymentStatus.replaceAll("_", " ")}
            </p>
            {order.price && order.paymentStatus !== "paid" ? (
              <Link href="/contact" className="portal-primary-button w-full">
                Proceed to payment
              </Link>
            ) : null}
          </section>

          <section className="portal-panel portal-delivery-card">
            <div className="portal-panel-heading">
              <div>
                <p className="portal-overline">Private delivery</p>
                <h2>Delivery files</h2>
              </div>
              <Download size={20} className="text-[#0b8f58]" />
            </div>
            {order.deliveryFiles.length ? (
              <div className="portal-file-list">
                {order.deliveryFiles.map((file) => (
                  <a key={file.url} href={file.url}>
                    <span>
                      <FileText size={18} />
                    </span>
                    <strong>{file.name}</strong>
                    <Download size={17} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="portal-file-empty">
                <Clock3 size={17} />
                Files will appear here after delivery.
              </p>
            )}
          </section>

          <p className="portal-secure-note">
            <LockKeyhole size={17} />
            These files are private and intended only for your account.
          </p>
        </aside>
      </div>
    </div>
  );
}
