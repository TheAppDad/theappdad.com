import type { PublicDirectoryMember } from "@/db/queries";

export function publicMemberLabel(member: Pick<PublicDirectoryMember, "displayName">) {
  const s = member.displayName?.trim();
  if (s) return s;
  return "App Dad";
}

export function formatPlatforms(platforms: string | null) {
  if (!platforms) return "—";
  if (platforms === "android") return "Android";
  if (platforms === "ios") return "iOS";
  if (platforms === "both") return "Android & iOS";
  return platforms;
}
