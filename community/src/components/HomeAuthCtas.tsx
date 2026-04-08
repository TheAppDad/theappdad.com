"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export function HomeAuthCtas() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <SignedOut>
        <Link
          href="/sign-up"
          className="inline-flex justify-center rounded-xl bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-hover transition-colors text-center"
        >
          Join the App Dads
        </Link>
        <Link
          href="/sign-in"
          className="inline-flex justify-center rounded-xl border border-community-border px-6 py-3 font-medium text-community-text hover:bg-community-surface transition-colors text-center"
        >
          Sign in
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          href="/dashboard"
          className="inline-flex justify-center rounded-xl bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-hover transition-colors text-center"
        >
          Go to dashboard
        </Link>
        <Link
          href="/onboarding"
          className="inline-flex justify-center rounded-xl border border-community-border px-6 py-3 font-medium text-community-text hover:bg-community-surface transition-colors text-center"
        >
          Continue onboarding
        </Link>
      </SignedIn>
    </div>
  );
}
