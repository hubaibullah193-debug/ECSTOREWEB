"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../auth.module.css";

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
      <div className={styles.authContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Check your email</h1>
          <p className={styles.subtitle}>
            We've sent a password reset link to {email}
          </p>
        </div>
        <Link
          href="/auth/login"
          className={styles.link}
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.subtitle}>
          Enter your email to receive a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorAlert}>
            {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className={styles.footer}>
        <Link href="/auth/login" className={styles.link}>
          Back to login
        </Link>
      </div>
    </div>
  );
}
