"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function SiteHeader() {
  return (
    <header className="border-b border-community-border bg-community-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-community-text hover:text-accent transition-colors"
        >
          The App Dads
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/community"
            className="text-community-muted hover:text-community-text hidden sm:inline"
          >
            Community
          </Link>
          <Link
            href="/community/members"
            className="text-community-muted hover:text-community-text hidden sm:inline"
          >
            Members
          </Link>
          <Link
            href="/legal/terms"
            className="text-community-muted hover:text-community-text hidden sm:inline"
          >
            Terms
          </Link>
          <Link
            href="/legal/privacy"
            className="text-community-muted hover:text-community-text hidden sm:inline"
          >
            Privacy
          </Link>
          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-lg bg-accent px-3 py-1.5 font-medium text-white hover:bg-accent-hover transition-colors"
            >
              Sign in
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-community-muted hover:text-community-text"
            >
              Dashboard
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
