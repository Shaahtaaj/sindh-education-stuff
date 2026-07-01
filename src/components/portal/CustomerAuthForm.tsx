"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "login" | "register";

export function CustomerAuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(`/api/portal/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Unable to continue.");
      router.push("/portal/dashboard");
      router.refresh();
    } catch (problem) {
      setError(
        problem instanceof Error ? problem.message : "Unable to continue.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="portal-auth-form">
      {mode === "register" ? (
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
      ) : null}
      {mode === "register" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="portal-field">
            <span>Full name</span>
            <input name="name" autoComplete="name" required minLength={2} />
          </label>
          <label className="portal-field">
            <span>WhatsApp number</span>
            <input
              name="phone"
              autoComplete="tel"
              required
              placeholder="+92…"
            />
          </label>
        </div>
      ) : null}
      <label className="portal-field">
        <span>Email address</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="portal-field">
        <span>Password</span>
        <span className="portal-password-field">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>
      {error ? (
        <p role="alert" className="portal-form-error">
          {error}
        </p>
      ) : null}
      <button disabled={loading} className="portal-primary-button w-full">
        {loading ? (
          "Please wait…"
        ) : (
          <>
            {mode === "login" ? "Sign in" : "Create account"}
            <ArrowRight size={17} />
          </>
        )}
      </button>
      <p className="portal-auth-switch">
        {mode === "login" ? "New customer?" : "Already registered?"}{" "}
        <Link href={mode === "login" ? "/portal/register" : "/portal/login"}>
          {mode === "login" ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
