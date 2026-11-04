"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { WEEKDAYS } from "@/constants/categories";
import BrandLogo from "@/components/ui/brand-logo";
import Icon from "@/components/ui/icon";
import { authClient } from "@/lib/auth-client";

export default function AuthScreen() {
  const searchParams = useSearchParams();
  const initialError =
    searchParams.get("error") === "google"
      ? "Google sign-in could not be completed. Please try again."
      : undefined;
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(initialError);
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const leadingDays = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();
  const totalCells = Math.ceil((leadingDays + daysInMonth) / 7) * 7;
  const miniCalendarDays = Array.from({ length: totalCells }, (_, index) => {
    const day = index - leadingDays + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  async function signInWithGoogle() {
    setIsPending(true);
    setError(undefined);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/calendar",
        errorCallbackURL: "/login?error=google",
      });

      if (result.error) {
        setError(result.error.message || "Google sign-in could not be started.");
      }
    } catch {
      setError(
        "Google sign-in is unavailable. Check that authentication and database settings are configured.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-form-wrap">
        <div className="auth-content">
          <div className="brand auth-brand">
            <BrandLogo className="brand-mark auth-brand-mark" />
            <span className="auth-brand-copy">
              <span className="brand-wordmark auth-wordmark">Cheveryday</span>
              <span className="auth-tagline">Make every day meaningful.</span>
            </span>
          </div>
          <div className="auth-copy">
            <p className="eyebrow">WELCOME BACK</p>
            <h1>Make time for what matters.</h1>
            <p>Your time, tasks, and progress — all in one calm place.</p>
          </div>
          <div className="auth-form">
            <button
              className="google-signin"
              type="button"
              onClick={signInWithGoogle}
              disabled={isPending}
            >
              {isPending ? (
                <Icon name="loader" size={20} />
              ) : (
                <Image
                  className="google-mark"
                  src="/icons/google_icon.svg"
                  alt=""
                  aria-hidden="true"
                  width={22}
                  height={22}
                  unoptimized
                />
              )}
              <span>
                {isPending ? "Connecting to Google..." : "Continue with Google"}
              </span>
            </button>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
          </div>
          <p className="auth-privacy">
            Secure sign-in powered by Google. We never store your Google
            password.
          </p>
        </div>
      </section>
      <section className="auth-art">
        <div className="art-copy">
          <span className="art-pill">A calmer way to plan</span>
          <h2>
            Turn busy days into
            <br />
            meaningful progress.
          </h2>
          <p>
            Plan with intention. Reflect with clarity.
            <br />
            Build momentum that lasts.
          </p>
        </div>
        <div className="mini-calendar">
          <div className="mini-top">
            <div>
              <small>YOUR MONTH</small>
              <strong>
                {new Intl.DateTimeFormat("en", {
                  month: "long",
                  year: "numeric",
                }).format(today)}
              </strong>
            </div>
            <div className="mini-arrows">‹　›</div>
          </div>
          <div className="mini-grid mini-labels">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day[0]}</span>
            ))}
          </div>
          <div className="mini-grid">
            {miniCalendarDays.map((day, index) => (
              <div
                key={`${today.getFullYear()}-${today.getMonth()}-${index}`}
                className={day === today.getDate() ? "mini-today" : ""}
              >
                {day && <span>{day}</span>}
              </div>
            ))}
          </div>
        </div>
        <p className="quote">
          “The secret of getting ahead is getting started.”
          <span>— Mark Twain</span>
        </p>
      </section>
    </main>
  );
}
