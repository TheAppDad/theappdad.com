import { auth, currentUser } from "@clerk/nextjs/server";

export type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

function rethrowIfNextDynamicUsage(e: unknown): void {
  const digest =
    e && typeof e === "object" && "digest" in e
      ? String((e as { digest?: string }).digest)
      : "";
  if (digest === "DYNAMIC_SERVER_USAGE") {
    throw e;
  }
}

/**
 * Wraps Clerk `currentUser()` so a misconfigured or unreachable Clerk API
 * does not crash the whole page with HTTP 500.
 */
export async function getCurrentUserSafe(): Promise<{
  user: ClerkUser | null;
  authError: boolean;
}> {
  try {
    const user = await currentUser();
    return { user, authError: false };
  } catch (e: unknown) {
    rethrowIfNextDynamicUsage(e);
    console.error("[getCurrentUserSafe]", e);
    return { user: null, authError: true };
  }
}

/** Same idea as {@link getCurrentUserSafe} for `auth()`. */
export async function getAuthSafe(): Promise<{
  userId: string | null;
  authError: boolean;
}> {
  try {
    const { userId } = await auth();
    return { userId: userId ?? null, authError: false };
  } catch (e: unknown) {
    rethrowIfNextDynamicUsage(e);
    console.error("[getAuthSafe]", e);
    return { userId: null, authError: true };
  }
}
