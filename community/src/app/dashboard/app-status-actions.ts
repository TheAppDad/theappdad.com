"use server";

import { revalidatePath } from "next/cache";
import type { AppStatusFormState } from "./app-status-types";
import { upsertAppStoreReport } from "@/db/queries";
import { getAuthSafe } from "@/lib/getCurrentUserSafe";

export async function submitAppStoreStatus(
  _prev: AppStatusFormState,
  formData: FormData
): Promise<AppStatusFormState> {
  const { userId, authError } = await getAuthSafe();
  if (authError) {
    return {
      error: "Sign-in service unavailable. Check Clerk keys in .env.local.",
      ok: false,
    };
  }
  if (!userId) {
    return { error: "Sign in required.", ok: false };
  }

  const appName = String(formData.get("appName") ?? "").trim().slice(0, 200);
  const status = String(formData.get("status") ?? "");

  if (appName.length < 2) {
    return {
      error: "Enter your app’s name (at least 2 characters).",
      ok: false,
    };
  }

  if (status !== "in_review" && status !== "distributed") {
    return { error: "Choose in review or distributed.", ok: false };
  }

  const result = await upsertAppStoreReport(userId, appName, status);
  if (!result.ok) {
    return { error: result.error, ok: false };
  }

  revalidatePath("/community");
  revalidatePath("/dashboard");
  return { error: null, ok: true };
}
