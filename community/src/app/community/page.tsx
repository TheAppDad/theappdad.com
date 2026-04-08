import Link from "next/link";
import { CommunityNewMembersTicker } from "@/components/CommunityNewMembersTicker";
import { DbMigrationBanner } from "@/components/DbMigrationBanner";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getCommunityLeaderboard,
  getCommunityPulse,
  getCommunityTickerMembers,
} from "@/db/queries";
import { publicMemberLabel } from "@/lib/memberDisplay";

export const dynamic = "force-dynamic";

function StatBlock({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="community-stat rounded-xl border border-community-border bg-community-surface p-5">
      <p className="label text-community-muted text-xs uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="value text-3xl font-bold text-community-text">{value}</p>
      {hint ? (
        <p className="hint text-community-muted text-xs mt-2 leading-relaxed">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default async function CommunityPage() {
  let pulse = null;
  let dbError = false;
  try {
    pulse = await getCommunityPulse();
  } catch (e) {
    console.error("[community] pulse", e);
    dbError = true;
  }

  const [tickerMembers, leaderboard] = await Promise.all([
    getCommunityTickerMembers(),
    getCommunityLeaderboard(),
  ]);
  const tickerNames = tickerMembers.map((m) => publicMemberLabel(m));

  const dash = (n: number | null | undefined) =>
    n == null ? "—" : String(n);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-accent text-sm font-medium tracking-wide uppercase mb-2">
          The App Dads pulse
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-community-text mb-4">
          Community
        </h1>
        <p className="text-muted text-community-muted text-lg max-w-2xl mb-10 leading-relaxed">
          High-level numbers for The App Dads — separate from your personal{" "}
          <Link href="/dashboard" className="text-accent hover:underline">
            dashboard
          </Link>
          . App store stats are self-reported by members. Browse{" "}
          <Link href="/community/members" className="text-accent hover:underline">
            member profiles
          </Link>
          .
        </p>

        <section className="mb-10 max-w-2xl">
          <div className="flex flex-wrap items-end justify-between gap-2 mb-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-community-muted">
              New members
            </h2>
            <Link
              href="/community/members"
              className="text-xs text-accent hover:underline"
            >
              Full directory →
            </Link>
          </div>
          <CommunityNewMembersTicker names={tickerNames} />
        </section>

        <section className="mb-12 max-w-2xl">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-community-muted mb-3">
            Tester scoreboard
          </h2>
          <p className="text-community-muted text-xs mb-3 leading-relaxed">
            Sorted by tester score (exports, follow-ups, joining The App Dads).
          </p>
          {leaderboard.length === 0 ? (
            <p className="text-community-muted text-sm">
              Nobody on the board yet — complete onboarding to appear here.
            </p>
          ) : (
            <ol className="max-h-80 overflow-y-auto rounded-xl border border-community-border bg-community-surface divide-y divide-community-border">
              {leaderboard.map((m, i) => (
                <li key={m.id}>
                  <Link
                    href={`/community/members/${m.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-community-bg/50 transition-colors"
                  >
                    <span className="text-community-text min-w-0 truncate">
                      <span className="text-community-muted mr-2">{i + 1}.</span>
                      {publicMemberLabel(m)}
                    </span>
                    <span className="shrink-0 font-medium text-accent tabular-nums">
                      {m.testerScore}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </section>

        {dbError || pulse == null ? (
          <div className="mb-10">
            <DbMigrationBanner />
          </div>
        ) : null}

        {pulse ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            <StatBlock
              label="Profiles (App Dads)"
              value={dash(pulse.profilesTotal)}
              hint="Rows in our database (usually after a dashboard visit)."
            />
            <StatBlock
              label="Finished onboarding"
              value={dash(pulse.onboardingCompleted)}
              hint="Members who completed the join flow."
            />
            <StatBlock
              label="In The App Dads"
              value={dash(pulse.inCollective)}
              hint="Counted as members after onboarding."
            />
            <StatBlock
              label="New (7 days)"
              value={dash(pulse.newMembers7d)}
              hint="Profiles created in the last 7 days."
            />
            <StatBlock
              label="Play pool (Google)"
              value={dash(pulse.playPool)}
              hint="In The App Dads, onboarded, Google email synced — for CSV export gate."
            />
            <StatBlock
              label="Apps in review"
              value={dash(pulse.appsInReview)}
              hint="Self-reported: Play / App Store review (see dashboard form)."
            />
            <StatBlock
              label="Distributed / live"
              value={dash(pulse.appsDistributed)}
              hint="Self-reported: shipped or live on a store."
            />
          </div>
        ) : null}

        <section className="community-callout rounded-xl border border-dashed border-community-border p-6 max-w-2xl">
          <h2 className="font-semibold text-community-text mb-2">
            Help keep this accurate
          </h2>
          <p className="text-muted text-community-muted text-sm mb-4">
            Sign in and use{" "}
            <strong className="text-community-text">Update community pulse</strong>{" "}
            on your dashboard when your app moves from review to live (or back).
          </p>
          <Link
            href="/dashboard"
            className="inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
          >
            Go to dashboard
          </Link>
        </section>

        <p className="text-muted text-community-muted text-xs mt-12">
          <Link href="/" className="underline hover:text-community-text">
            ← Home
          </Link>
        </p>
      </main>
    </>
  );
}
