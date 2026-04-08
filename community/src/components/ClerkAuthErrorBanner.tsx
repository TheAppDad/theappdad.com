/** Shown when Clerk `currentUser()` throws (bad keys, outage, etc.). */
export function ClerkAuthErrorBanner() {
  return (
    <div
      className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
      role="alert"
    >
      <p className="font-medium text-amber-50">Sign-in service unavailable</p>
      <p className="mt-1 text-amber-100/90">
        Clerk couldn&apos;t load your session on the server. Confirm{" "}
        <code className="rounded bg-black/20 px-1">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>{" "}
        and <code className="rounded bg-black/20 px-1">CLERK_SECRET_KEY</code> in{" "}
        <code className="rounded bg-black/20 px-1">community/.env.local</code>, restart{" "}
        <code className="rounded bg-black/20 px-1">npm run dev</code>, and check the terminal
        for the underlying error.
      </p>
    </div>
  );
}
