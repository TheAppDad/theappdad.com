"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { completeOnboarding as persistOnboarding } from "@/db/queries";
import { getAuthSafe } from "@/lib/getCurrentUserSafe";
import type { OnboardingFormState } from "./types";

export async function submitOnboarding(
  _prev: OnboardingFormState,
  formData: FormData
): Promise<OnboardingFormState> {
  const { userId, authError } = await getAuthSafe();
  if (authError) {
    return {
      error:
        "Sign-in service unavailable. Check Clerk keys in .env.local and restart the dev server.",
    };
  }
  if (!userId) {
    return { error: "You need to be signed in." };
  }

  const buildingSummary = String(formData.get("buildingSummary") ?? "").trim();
  const platforms = String(formData.get("platforms") ?? "");
  const terms = formData.get("terms") === "on";
  const privacy = formData.get("privacy") === "on";
  const csvConsent = formData.get("csvConsent") === "on";

  if (buildingSummary.length < 8) {
    return {
      error: "Please add a short description of what you’re building (at least 8 characters).",
    };
  }

  if (!["android", "ios", "both"].includes(platforms)) {
    return { error: "Choose a platform option." };
  }

  if (!terms || !privacy || !csvConsent) {
    return {
      error: "Accept the terms, privacy policy, and CSV / email understanding to continue.",
    };
  }

  const result = await persistOnboarding(userId, {
    buildingSummary,
    platforms: platforms as "android" | "ios" | "both",
  });

  if (!result.ok) {
    return { error: result.error };
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  redirect("/dashboard");
}
