import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getCommunityLeaderboard } from "@/db/queries";
import { formatPlatforms, publicMemberLabel } from "@/lib/memberDisplay";

export const dynamic = "force-dynamic";

export default async function MembersDirectoryPage() {
  const members = await getCommunityLeaderboard();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-accent text-sm font-medium tracking-wide uppercase mb-2">
          Directory
        </p>
        <h1 className="text-3xl font-bold text-community-text mb-2">
          The App Dads
        </h1>
        <p className="text-community-muted text-sm mb-8 leading-relaxed">
          Members who finished onboarding. Tester score goes up when
          you export a CSV, answer the distribution check-in, and take part in The App Dads.
          No emails shown here — say hi in whatever channels you use together.
        </p>

        {members.length === 0 ? (
          <p className="text-community-muted text-sm">
            No public profiles yet. Complete onboarding and open the dashboard once
            to sync your display name.
          </p>
        ) : (
          <ul className="space-y-3">
            {members.map((m, index) => (
              <li key={m.id}>
                <Link
                  href={`/community/members/${m.id}`}
                  className="block rounded-xl border border-community-border bg-community-surface p-4 transition-colors hover:border-accent/40"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold text-community-text">
                      <span className="text-community-muted font-normal text-sm mr-2">
                        #{index + 1}
                      </span>
                      {publicMemberLabel(m)}
                    </span>
                    <span className="text-sm font-medium text-accent">
                      Tester score {m.testerScore}
                    </span>
                  </div>
                  <p className="text-community-muted text-xs mt-2">
                    {formatPlatforms(m.platforms)} · Joined{" "}
                    {m.createdAt.toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="text-community-muted text-xs mt-10">
          <Link href="/community" className="text-accent hover:underline">
            ← Community pulse
          </Link>
        </p>
      </main>
    </>
  );
}
