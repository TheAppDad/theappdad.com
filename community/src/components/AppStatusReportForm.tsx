"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { submitAppStoreStatus } from "@/app/dashboard/app-status-actions";
import type { AppStatusFormState } from "@/app/dashboard/app-status-types";

const initialState: AppStatusFormState = { error: null, ok: false };

type Props = {
  /** Set only from a real CSV export row (`export_audit.app_name`); otherwise omit / null. */
  defaultAppName?: string | null;
  /** False until a CSV export has stored an app name — form stays disabled. */
  canEditAppName: boolean;
};

function normalizeCsvAppName(value: string | null | undefined): string {
  const t = value?.trim() ?? "";
  return t.length >= 2 ? t : "";
}

export function AppStatusReportForm({
  defaultAppName = null,
  canEditAppName,
}: Props) {
  const [appName, setAppName] = useState(
    () => normalizeCsvAppName(defaultAppName)
  );

  useEffect(() => {
    if (!canEditAppName) {
      setAppName("");
      return;
    }
    const next = normalizeCsvAppName(defaultAppName);
    if (next) {
      setAppName(next);
    }
  }, [defaultAppName, canEditAppName]);

  const [state, formAction, pending] = useActionState<
    AppStatusFormState,
    FormData
  >(submitAppStoreStatus, initialState);

  const formLocked = !canEditAppName || pending;

  return (
    <form action={formAction} className="space-y-3">
      {state.error ? (
        <p
          className="text-sm text-red-300 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="text-sm text-accent font-medium">
          Saved — community pulse updated.
        </p>
      ) : null}

      {!canEditAppName ? (
        <p className="text-xs text-community-muted rounded-lg border border-dashed border-community-border bg-community-bg/60 px-3 py-2">
          Download a tester CSV (with an app name filled in) from{" "}
          <strong className="text-community-text font-medium">Export tester CSV</strong>{" "}
          above to unlock this form.
        </p>
      ) : null}

      <div>
        <label
          htmlFor="pulse-app-name"
          className="block text-xs font-medium text-community-muted mb-1"
        >
          App name
        </label>
        <input
          id="pulse-app-name"
          name="appName"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          required={canEditAppName}
          minLength={2}
          maxLength={200}
          placeholder=""
          autoComplete="off"
          disabled={formLocked}
          className="w-full rounded-lg border border-community-border bg-community-bg px-3 py-2 text-sm text-community-text placeholder:text-community-muted focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="pulse-status"
          className="block text-xs font-medium text-community-muted mb-1"
        >
          Store status
        </label>
        <select
          id="pulse-status"
          name="status"
          required={canEditAppName}
          disabled={formLocked}
          className="w-full rounded-lg border border-community-border bg-community-bg px-3 py-2 text-sm text-community-text focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50"
        >
          <option value="in_review">In review (Play / App Store)</option>
          <option value="distributed">Live / distributed</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={formLocked}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
      >
        {pending ? "Saving…" : "Update community pulse"}
      </button>
      <p className="text-xs text-community-muted">
        Counts on{" "}
        <Link href="/community" className="text-accent hover:underline">
          Community
        </Link>{" "}
        update when you save. One row per app name per account.
      </p>
    </form>
  );
}
