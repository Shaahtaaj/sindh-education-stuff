"use client";

import { ArrowRight, Check, ClipboardList, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { programs } from "@/lib/constants";

const services = [
  "Assignment guidance",
  "Formatting and typing",
  "Research 8613 guidance",
  "Lesson plan support",
  "Teaching practice support",
  "Review and feedback",
];

const formSteps = ["Request details", "Service", "Instructions", "Review"];

export function RequestForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/portal/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error ?? "Unable to submit request.");
      router.push(`/portal/requests/${body.id}`);
      router.refresh();
    } catch (problem) {
      setError(
        problem instanceof Error
          ? problem.message
          : "Unable to submit request.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="portal-request-form">
      <div className="portal-form-steps" aria-label="Request form stages">
        {formSteps.map((label, index) => (
          <div key={label} className={index === 0 ? "is-active" : ""}>
            <span>{index === 0 ? <Check size={14} /> : index + 1}</span>
            <p>{label}</p>
          </div>
        ))}
      </div>

      <section className="portal-form-section">
        <div className="portal-form-section-heading">
          <span>
            <ClipboardList size={19} />
          </span>
          <div>
            <h2>Request details</h2>
            <p>Choose the course and support you need.</p>
          </div>
        </div>
        <div className="portal-form-grid">
          <label className="portal-field">
            <span>Program</span>
            <select name="program" required defaultValue="">
              <option value="" disabled>
                Select your program
              </option>
              {programs.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label className="portal-field">
            <span>Course code</span>
            <input
              name="courseCode"
              required
              placeholder="Example: 8612"
            />
          </label>
          <label className="portal-field">
            <span>Support type</span>
            <select name="serviceType" required defaultValue="">
              <option value="" disabled>
                Select a service
              </option>
              {services.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label className="portal-field">
            <span>Preferred deadline</span>
            <input
              name="deadline"
              type="date"
              required
              min={new Date().toISOString().slice(0, 10)}
            />
          </label>
        </div>
      </section>

      <section className="portal-form-section">
        <div className="portal-form-section-heading">
          <span>
            <FileText size={19} />
          </span>
          <div>
            <h2>Instructions</h2>
            <p>Add enough detail for an accurate review and quotation.</p>
          </div>
        </div>
        <label className="portal-field">
          <span>What help do you need?</span>
          <textarea
            name="message"
            required
            minLength={10}
            rows={7}
            placeholder="Describe the assignment, requirements, format and any important instructions."
          />
        </label>
      </section>

      <div className="portal-form-footer">
        <p>
          You remain responsible for your original academic work. We provide
          guidance, formatting, tutoring and review support.
        </p>
        {error ? (
          <p role="alert" className="portal-form-error">
            {error}
          </p>
        ) : null}
        <button disabled={loading} className="portal-primary-button">
          {loading ? (
            "Submitting…"
          ) : (
            <>
              Submit request <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
