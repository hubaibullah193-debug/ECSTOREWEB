"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp.email(
        {
          name,
          email,
          password,
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            window.location.href = "/";
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Sign up failed");
            setLoading(false);
          },
        }
      );
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-[var(--space-6)]">
      <div className="text-center space-y-[var(--space-2)]">
        <h1 className="text-2xl font-serif font-bold">Create Account</h1>
        <p className="text-sm text-gray-600">
          Join Khan Glowcare Center
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-[var(--space-4)]">
        {error && (
          <div className="p-[var(--space-3)] bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-[var(--space-2)]">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-[var(--space-3)] py-[var(--space-2)] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            disabled={loading}
          />
        </div>

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

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-[var(--space-2)]">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="text-center text-sm">
        <p>
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[var(--color-accent)] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
