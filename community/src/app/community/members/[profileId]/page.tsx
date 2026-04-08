import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getPublicProfileById } from "@/db/queries";
import { formatPlatforms, publicMemberLabel } from "@/lib/memberDisplay";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ profileId: string }> };

export default async function PublicMemberProfilePage({ params }: Props) {
  const { profileId } = await params;
  const profile = await getPublicProfileById(profileId);

  if (!profile) {
    notFound();
  }

  const label = publicMemberLabel(profile);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-accent text-sm font-medium tracking-wide uppercase mb-2">
          Member profile
        </p>
        <h1 className="text-3xl font-bold text-community-text mb-2">
          {label}
        </h1>
        <p className="text-community-muted text-sm mb-8">
          Tester score{" "}
          <span className="text-accent font-semibold">{profile.testerScore}</span>
          {" · "}
          Joined{" "}
          {profile.createdAt.toLocaleDateString(undefined, {
            dateStyle: "medium",
          })}
        </p>

        <div className="rounded-xl border border-community-border bg-community-surface p-5 space-y-4">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-wide text-community-muted mb-1">
              Building
            </h2>
            <p className="text-sm text-community-text leading-relaxed">
              {profile.buildingSummary?.trim() || "—"}
            </p>
          </div>
          <div>
            <h2 className="text-xs font-medium uppercase tracking-wide text-community-muted mb-1">
              Platforms
            </h2>
            <p className="text-sm text-community-text">
              {formatPlatforms(profile.platforms)}
            </p>
          </div>
        </div>

        <p className="text-community-muted text-xs mt-8 leading-relaxed">
          This is what they chose to share during onboarding. Google account
          details stay private.
        </p>

        <p className="text-community-muted text-xs mt-6 flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/community/members" className="text-accent hover:underline">
            ← All members
          </Link>
          <Link href="/community" className="text-accent hover:underline">
            Community pulse
          </Link>
        </p>
      </main>
    </>
  );
}
