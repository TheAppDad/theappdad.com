/** Shown when database queries fail (often schema not migrated). */
export function DbMigrationBanner() {
  return (
    <div
      className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
      role="alert"
    >
      <p className="font-medium text-amber-50">Database couldn’t load</p>
      <p className="mt-1 text-amber-100/90">
        From the <code className="rounded bg-black/20 px-1">community</code>{" "}
        folder run{" "}
        <code className="rounded bg-black/20 px-1">npm run db:push</code>, then
        restart <code className="rounded bg-black/20 px-1">npm run dev</code>.
      </p>
    </div>
  );
}
