"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-community-bg text-community-text font-sans px-4 py-12">
      <main className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-community-muted text-sm mb-6 leading-relaxed">
          The app hit an unexpected error. Check the terminal where{" "}
          <code className="text-community-text">npm run dev</code> is running
          for the stack trace. Try{" "}
          <code className="text-community-text">npm run clean</code> from the{" "}
          <code className="text-community-text">community</code> folder, then
          restart dev.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-community-border px-5 py-2.5 text-sm font-medium hover:bg-community-surface transition-colors"
          >
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}
