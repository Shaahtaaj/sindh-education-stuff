import { Check } from "lucide-react";

const steps = [
  { status: "new", label: "Received" },
  { status: "waiting_for_payment", label: "Awaiting payment" },
  { status: "in_progress", label: "In progress" },
  { status: "completed", label: "Delivered" },
];

const stepIndex: Record<string, number> = {
  new: 0,
  waiting_for_payment: 1,
  in_progress: 2,
  completed: 3,
};

export function ProgressTimeline({
  status,
  compact = false,
}: {
  status: string;
  compact?: boolean;
}) {
  const current = stepIndex[status] ?? 0;
  const cancelled = status === "cancelled";

  return (
    <div
      className={`portal-progress ${compact ? "portal-progress-compact" : ""}`}
      aria-label="Request progress"
    >
      <span
        className="portal-progress-line"
        style={{
          width: cancelled ? "0%" : `${(current / (steps.length - 1)) * 100}%`,
        }}
      />
      {steps.map((step, index) => {
        const done = !cancelled && index <= current;
        return (
          <div key={step.status} className="portal-progress-step">
            <span className={`portal-progress-dot ${done ? "is-done" : ""}`}>
              {index < current ? <Check size={15} strokeWidth={2.5} /> : index + 1}
            </span>
            <span className={`portal-progress-label ${done ? "is-done" : ""}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
