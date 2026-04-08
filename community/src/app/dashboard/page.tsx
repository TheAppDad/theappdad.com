import Link from "next/link";
import { redirect } from "next/navigation";
import { AppStatusReportForm } from "@/components/AppStatusReportForm";
import { ClerkAuthErrorBanner } from "@/components/ClerkAuthErrorBanner";
import { DbMigrationBanner } from "@/components/DbMigrationBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { ExportCard } from "@/components/ExportCard";
import {
  ExportFollowupPanel,
  type DueFollowupItem,
  type UpcomingFollowup,
} from "@/components/ExportFollowupPanel";
import {
  collectiveMemberCount,
  ensureProfile,
  exportThresholdMet,
  getDueExportFollowups,
  getLatestCsvExportAppName,
  getUpcomingExportFollowup,
  googleLinkedPoolCount,
  syncGooglePlayEmail,
  syncProfileDisplayName,
  userExportCountLast7Days,
} from "@/db/queries";
import { clerkPublicDisplayName } from "@/lib/clerkDisplayName";
import { getCurrentUserSafe } from "@/lib/getCurrentUserSafe";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user, authError } = await getCurrentUserSafe();

  if (authError) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <h1 className="text-2xl font-bold text-community-text mb-2">
            Dashboard
          </h1>
          <ClerkAuthErrorBanner />
        </main>
      </>
    );
  }

  if (!user?.id) {
    redirect("/sign-in");
  }

  let profile = null;
  try {
    if (user?.id != null) {
      profile = await ensureProfile(user.id);
      await syncProfileDisplayName(user.id, clerkPublicDisplayName(user));
    }
  } catch (e) {
    console.error("[dashboard] ensureProfile", e);
  }

  if (profile && !profile.onboardingCompletedAt) {
    redirect("/onboarding");
  }

  const primaryEmail = user?.primaryEmailAddress?.emailAddress ?? null;
  const googleAccount = user?.externalAccounts?.find(
    (a) =>
      a.provider === "google" ||
      a.provider === "oauth_google" ||
      (a.provider as string)?.includes("google")
  );
  const googleLinked = Boolean(googleAccount);

  let dbError = false;
  let memberCount: number | null = null;
  let playPoolCount: number | null = null;
  let exportCount: number | null = null;
  let dueFollowups: DueFollowupItem[] = [];
  let upcoming: UpcomingFollowup | null = null;
  let pulseDefaultAppName: string | null = null;

  try {
    if (user?.id && googleAccount?.emailAddress) {
      await syncGooglePlayEmail(user.id, googleAccount.emailAddress);
    }

    memberCount = await collectiveMemberCount();
    playPoolCount = await googleLinkedPoolCount();
    exportCount =
      user?.id != null ? await userExportCountLast7Days(user.id) : null;

    pulseDefaultAppName =
      user?.id != null
        ? await getLatestCsvExportAppName(user.id)
        : null;

    const dueRowsRaw =
      user?.id != null ? await getDueExportFollowups(user.id) : null;
    const upcomingRaw =
      user?.id != null ? await getUpcomingExportFollowup(user.id) : null;

    dueFollowups = (dueRowsRaw ?? [])
      .filter((r) => r.followupDueAt)
      .map((r) => ({
        id: r.id,
        appName: r.appName?.trim() || "Your app",
        followupDueAt: r.followupDueAt!.toISOString(),
      }));

    upcoming = upcomingRaw?.followupDueAt
      ? {
          appName: upcomingRaw.appName?.trim() || "Your app",
          followupDueAt: upcomingRaw.followupDueAt.toISOString(),
        }
      : null;
  } catch (e) {
    console.error("[dashboard] stats / follow-ups", e);
    dbError = true;
  }

  const inCollective = profile?.inCollective ?? false;
  const thresholdMet =
    playPoolCount != null ? exportThresholdMet(playPoolCount) : false;
  const onCooldown = exportCount != null && exportCount > 0;

  const collectiveLabel =
    memberCount != null ? String(memberCount) : "—";
  const playPoolLabel =
    playPoolCount != null ? String(playPoolCount) : "—";
  const exportsLabel =
    exportCount != null ? String(exportCount) : "—";

  const pulseAppNameFromCsv = pulseDefaultAppName?.trim() ?? "";
  const canEditPulseAppName = pulseAppNameFromCsv.length >= 2;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-community-text mb-2">
          Dashboard
        </h1>
        <p className="text-community-muted text-sm mb-8">
          Signed in as{" "}
          <span className="text-community-text font-medium">
            {user?.username || primaryEmail || user?.id}
          </span>
        </p>

        {dbError ? <DbMigrationBanner /> : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <StatCard
            label="The App Dads"
            value={collectiveLabel}
            hint={
              memberCount != null
                ? "People who have finished onboarding as members of The App Dads"
                : "Set DATABASE_URL + run db:push"
            }
          />
          <StatCard
            label="Play pool"
            value={playPoolLabel}
            hint="Google linked + email synced (export needs ≥15)"
          />
          <StatCard
            label="Your tester score"
            value={
              profile != null ? String(profile.testerScore ?? 0) : "—"
            }
            hint="Onboarding, CSV exports, distribution check-ins"
          />
          <StatCard
            label="Exports (7d)"
            value={exportsLabel}
            hint="Max 1 CSV per 7 days"
          />
        </div>

        <div className="space-y-6">
          <ExportFollowupPanel due={dueFollowups} upcoming={upcoming} />

          <ExportCard
            googleLinked={googleLinked}
            inCollective={inCollective}
            thresholdMet={thresholdMet}
            onCooldown={onCooldown}
            playPoolCount={playPoolCount}
          />

          <section className="rounded-xl border border-community-border bg-community-surface p-5">
            <h2 className="font-semibold text-community-text mb-2">
              Community pulse — app store status
            </h2>
            <p className="text-community-muted text-sm mb-4">
              Report whether your app is in review or already distributed. Totals
              show on the public{" "}
              <Link href="/community" className="text-accent hover:underline">
                Community
              </Link>{" "}
              page.
            </p>
            <p className="text-community-muted text-xs mb-4 leading-relaxed">
              This section stays <strong className="text-community-text font-medium">locked</strong>{" "}
              until you successfully download a tester CSV using the app name in{" "}
              <strong className="text-community-text font-medium">Export tester CSV</strong>{" "}
              above. Then the name from that export appears here and you can edit it
              before saving.
            </p>
            <AppStatusReportForm
              defaultAppName={pulseDefaultAppName}
              canEditAppName={canEditPulseAppName}
            />
          </section>

          <section className="rounded-xl border border-community-border bg-community-surface p-5">
            <h2 className="font-semibold text-community-text mb-2">
              Google account for Play
            </h2>
            <p className="text-community-muted text-sm mb-3">
              CSV export will only work when you sign in with Google or connect a
              Google account in Clerk — use the same account you use for Play
              Console and closed-test invites.
            </p>
            {googleLinked ? (
              <p className="text-accent text-sm font-medium">
                Google linked ✓ ({googleAccount?.emailAddress ?? "connected"})
              </p>
            ) : (
              <p className="text-community-muted text-sm">
                No Google account linked to this profile yet. In production,
                add &quot;Connect Google&quot; via Clerk or sign in with Google.
              </p>
            )}
          </section>

          <section className="rounded-xl border border-dashed border-community-border p-5">
            <h2 className="font-semibold text-community-text mb-2">
              Next build steps
            </h2>
            <ul className="text-community-muted text-sm list-disc list-inside space-y-1">
              <li>Noticeboard + directory</li>
              <li>Clerk webhook to sync Google email without dashboard visit</li>
            </ul>
            <Link
              href="/onboarding"
              className="inline-block mt-4 text-accent text-sm font-medium hover:underline"
            >
              Review onboarding →
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-community-border bg-community-surface p-4">
      <p className="text-community-muted text-xs uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-xl font-bold text-community-text">{value}</p>
      <p className="text-community-muted text-xs mt-1">{hint}</p>
    </div>
  );
}
