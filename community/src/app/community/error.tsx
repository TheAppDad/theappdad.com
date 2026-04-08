"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function CommunityError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[community/error]", error);
  }, [error]);

  return (
    <div className="community-shell font-sans min-h-screen px-4 py-12 sm:px-6">
      <main className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-community-text mb-2">
          Something went wrong
        </h1>
        <p className="text-community-muted text-sm mb-6 leading-relaxed">
          This page couldn&apos;t load. Check the terminal for the server error,
          confirm Clerk keys and <code className="text-community-text">DATABASE_URL</code>{" "}
          in <code className="text-community-text">.env.local</code>, then try again.
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
            className="inline-flex items-center rounded-xl border border-community-border px-5 py-2.5 text-sm font-medium text-community-text hover:bg-community-surface transition-colors"
          >
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}
