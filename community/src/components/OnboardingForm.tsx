"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitOnboarding } from "@/app/onboarding/actions";
import type { OnboardingFormState } from "@/app/onboarding/types";

const initialState: OnboardingFormState = { error: null };

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState<
    OnboardingFormState,
    FormData
  >(submitOnboarding, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <p
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div>
        <label
          htmlFor="buildingSummary"
          className="block text-sm font-medium text-community-text mb-1.5"
        >
          What are you building?
        </label>
        <textarea
          id="buildingSummary"
          name="buildingSummary"
          required
          rows={3}
          minLength={8}
          placeholder="e.g. Indie puzzle game for Android, shipping to Play closed testing soon."
          className="w-full rounded-xl border border-community-border bg-community-bg px-3 py-2 text-sm text-community-text placeholder:text-community-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      <div>
        <label
          htmlFor="platforms"
          className="block text-sm font-medium text-community-text mb-1.5"
        >
          Primary platform
        </label>
        <select
          id="platforms"
          name="platforms"
          required
          defaultValue=""
          className="w-full rounded-xl border border-community-border bg-community-bg px-3 py-2 text-sm text-community-text focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="" disabled>
            Choose one
          </option>
          <option value="android">Android (Google Play)</option>
          <option value="ios">iOS (App Store)</option>
          <option value="both">Both</option>
        </select>
      </div>

      <fieldset className="space-y-3 rounded-xl border border-community-border bg-community-surface p-4">
        <legend className="text-sm font-medium text-community-text px-1">
          Agreements
        </legend>
        <label className="flex gap-3 text-sm text-community-muted cursor-pointer">
          <input
            type="checkbox"
            name="terms"
            className="mt-0.5 rounded border-community-border"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/legal/terms"
              className="text-accent underline hover:text-accent-hover"
              target="_blank"
            >
              Terms
            </Link>
            .
          </span>
        </label>
        <label className="flex gap-3 text-sm text-community-muted cursor-pointer">
          <input
            type="checkbox"
            name="privacy"
            className="mt-0.5 rounded border-community-border"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/legal/privacy"
              className="text-accent underline hover:text-accent-hover"
              target="_blank"
            >
              Privacy policy
            </Link>
            .
          </span>
        </label>
        <label className="flex gap-3 text-sm text-community-muted cursor-pointer">
          <input
            type="checkbox"
            name="csvConsent"
            className="mt-0.5 rounded border-community-border"
          />
          <span>
            I understand that if I join The App Dads tester pool for Play testing,
            the Google account email I use here may be included in
            member-generated CSVs shared under the community rules, and I
            accept the risks and responsibilities described in the{" "}
            <Link
              href="/legal/terms"
              className="text-accent underline hover:text-accent-hover"
              target="_blank"
            >
              Terms
            </Link>
            .
          </span>
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
      >
        {pending ? "Saving…" : "Join The App Dads"}
      </button>
    </form>
  );
}
