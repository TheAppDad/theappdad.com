import type { User } from "@clerk/nextjs/server";

/**
 * Public-safe label for the member directory (no full email in the UI).
 * Order: Clerk username → public metadata → OAuth username → email local-part
 * (handle-like) → first/last from the profile. Google often sends first+last as
 * “App” + “Dad” while the handle you care about lives in username or email.
 */
export function clerkPublicDisplayName(user: User): string | null {
  const username = user.username?.trim();
  if (username) return username.slice(0, 80);

  const pm = user.publicMetadata;
  if (pm && typeof pm === "object" && !Array.isArray(pm)) {
    const rec = pm as Record<string, unknown>;
    for (const key of [
      "communityDisplayName",
      "displayName",
      "handle",
      "publicUsername",
    ] as const) {
      const v = rec[key];
      if (typeof v === "string" && v.trim()) return v.trim().slice(0, 80);
    }
  }

  for (const ea of user.externalAccounts ?? []) {
    const x = ea.username?.trim();
    if (x) return x.slice(0, 80);
  }

  const primaryEmail =
    user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId) ??
    user.emailAddresses?.[0];
  const local = primaryEmail?.emailAddress?.split("@")[0]?.trim();
  if (
    local &&
    local.length >= 2 &&
    local.length <= 48 &&
    /^[\w.-]+$/i.test(local)
  ) {
    return local.slice(0, 80);
  }

  const first = user.firstName?.trim();
  const last = user.lastName?.trim();
  if (first && last) return `${first} ${last}`.slice(0, 80);
  if (first) return first.slice(0, 80);
  if (last) return last.slice(0, 80);

  return null;
}
