"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  googleLinked: boolean;
  inCollective: boolean;
  thresholdMet: boolean;
  onCooldown: boolean;
  playPoolCount: number | null;
};

export function ExportCard({
  googleLinked,
  inCollective,
  thresholdMet,
  onCooldown,
  playPoolCount,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [appName, setAppName] = useState("");

  const trimmed = appName.trim();
  const canExport =
    googleLinked &&
    inCollective &&
    thresholdMet &&
    !onCooldown &&
    !busy &&
    trimmed.length >= 2;

  async function handleExport() {
    if (trimmed.length < 2) return;
    setBusy(true);
    try {
      const res = await fetch("/api/export/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appName: trimmed.slice(0, 200) }),
      });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        if (ct.includes("application/json")) {
          const j = (await res.json()) as { error?: string };
          alert(j.error || "Export failed.");
        } else {
          alert("Export failed.");
        }
        return;
      }
      if (!ct.includes("text/csv")) {
        alert("Unexpected response.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "app-dads-testers.csv";
      a.click();
      URL.revokeObjectURL(url);
      setAppName("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const poolHint =
    playPoolCount != null
      ? `${playPoolCount} in the Play pool (need 15 with Google email synced).`
      : "Pool count loads when the database is connected.";

  return (
    <section className="rounded-xl border border-community-border bg-community-surface p-5">
      <h2 className="font-semibold text-community-text mb-2">
        Export tester CSV
      </h2>
      <p className="text-community-muted text-sm mb-4">
        For Google Play closed testing only. Up to 25 emails per file, one
        export per 7 days. After download we record your username and app
        name, start a 15-day timer, then ask (and optionally email) whether the
        app was ready for distribution.
      </p>
      <p className="text-community-muted text-xs mb-4">{poolHint}</p>

      {canExport || (googleLinked && inCollective && thresholdMet && !onCooldown) ? (
        <div className="mb-4">
          <label
            htmlFor="export-app-name"
            className="block text-xs font-medium text-community-muted mb-1.5"
          >
            App name (as in Play Console or marketing name)
          </label>
          <input
            id="export-app-name"
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            maxLength={200}
            placeholder="e.g. Pixel Puzzler"
            className="w-full rounded-xl border border-community-border bg-community-bg px-3 py-2 text-sm text-community-text placeholder:text-community-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      ) : null}

      <button
        type="button"
        disabled={!canExport}
        onClick={handleExport}
        className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {busy ? "Working…" : "Download CSV"}
      </button>
      {!googleLinked && (
        <p className="text-community-muted text-xs mt-3">
          Connect Google in Clerk to enable export (same account as Play
          Console).
        </p>
      )}
      {googleLinked && !inCollective && (
        <p className="text-community-muted text-xs mt-3">
          Complete onboarding and join The App Dads to export.
        </p>
      )}
      {googleLinked && inCollective && !thresholdMet && (
        <p className="text-community-muted text-xs mt-3">
          Export stays locked until 15 members have Google linked and have
          synced (open the dashboard once after linking).
        </p>
      )}
      {googleLinked && inCollective && thresholdMet && onCooldown && (
        <p className="text-community-muted text-xs mt-3">
          You&apos;re in the 7-day cooldown after your last export.
        </p>
      )}
      {googleLinked && inCollective && thresholdMet && !onCooldown && (
        <p className="text-community-muted text-xs mt-3">
          Enter the app name above so we can tie this export to your release.
        </p>
      )}
    </section>
  );
}
