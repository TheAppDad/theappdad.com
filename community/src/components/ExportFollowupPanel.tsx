"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type DueFollowupItem = {
  id: string;
  appName: string;
  followupDueAt: string;
};

export type UpcomingFollowup = {
  appName: string;
  followupDueAt: string;
};

function formatDue(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      dateStyle: "medium",
    });
  } catch {
    return iso;
  }
}

export function ExportFollowupPanel({
  due,
  upcoming,
}: {
  due: DueFollowupItem[];
  upcoming: UpcomingFollowup | null;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function submit(exportId: string, distributionReady: boolean) {
    setBusyId(exportId);
    try {
      const res = await fetch("/api/export/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exportId, distributionReady }),
      });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        if (ct.includes("application/json")) {
          const j = (await res.json()) as { error?: string };
          alert(j.error || "Could not save.");
        } else {
          alert("Could not save.");
        }
        return;
      }
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      {due.length > 0 ? (
        <section className="rounded-xl border border-accent/40 bg-accent/10 p-5">
          <h2 className="font-semibold text-community-text mb-2">
            Distribution check-in
          </h2>
          <p className="text-community-muted text-sm mb-4">
            It’s been 15 days since you downloaded a tester CSV. Was the app
            ready for distribution on Google Play?
          </p>
          <ul className="space-y-4">
            {due.map((row) => (
              <li
                key={row.id}
                className="rounded-lg border border-community-border bg-community-surface p-4"
              >
                <p className="text-sm text-community-text font-medium">
                  {row.appName}
                </p>
                <p className="text-xs text-community-muted mt-1">
                  Follow-up since {formatDue(row.followupDueAt)}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    type="button"
                    disabled={busyId === row.id}
                    onClick={() => submit(row.id, true)}
                    className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
                  >
                    Yes, ready / shipped
                  </button>
                  <button
                    type="button"
                    disabled={busyId === row.id}
                    onClick={() => submit(row.id, false)}
                    className="rounded-lg border border-community-border px-3 py-1.5 text-sm font-medium text-community-text hover:bg-community-bg disabled:opacity-50"
                  >
                    Not yet
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {upcoming && due.length === 0 ? (
        <section className="rounded-xl border border-community-border bg-community-surface p-4">
          <p className="text-sm text-community-muted">
            <span className="text-community-text font-medium">
              {upcoming.appName}
            </span>
            {" — "}
            distribution check-in unlocks on{" "}
            <span className="text-community-text">
              {formatDue(upcoming.followupDueAt)}
            </span>
            . We’ll email you that day if Resend is configured.
          </p>
        </section>
      ) : null}
    </div>
  );
}
