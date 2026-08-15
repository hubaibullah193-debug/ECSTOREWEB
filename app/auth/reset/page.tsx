"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset link");
      }

      setSuccess(true);
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-[var(--space-6)] text-center">
        <div>
          <h1 className="text-2xl font-serif font-bold">Check your email</h1>
          <p className="text-sm text-gray-600 mt-[var(--space-2)]">
            We've sent a password reset link to {email}
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-block text-[var(--color-accent)] font-medium hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-[var(--space-6)]">
      <div className="text-center space-y-[var(--space-2)]">
        <h1 className="text-2xl font-serif font-bold">Reset Password</h1>
        <p className="text-sm text-gray-600">
          Enter your email to receive a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-[var(--space-4)]">
        {error && (
          <div className="p-[var(--space-3)] bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-[var(--space-2)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-[var(--space-3)] py-[var(--space-2)] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-[var(--space-3)] bg-[var(--color-accent)] text-white rounded font-medium hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="text-center text-sm">
        <Link href="/auth/login" className="text-[var(--color-accent)] font-medium hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
