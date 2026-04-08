import Link from "next/link";
import { DbMigrationBanner } from "@/components/DbMigrationBanner";
import { HomeAuthCtas } from "@/components/HomeAuthCtas";
import { SiteHeader } from "@/components/SiteHeader";
import {
  collectiveMemberCount,
  EXPORT_THRESHOLD,
  googleLinkedPoolCount,
} from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function CommunityHomePage() {
  let collectiveCount: number | null = null;
  let playPoolCount: number | null = null;
  let dbError = false;

  try {
    collectiveCount = await collectiveMemberCount();
    playPoolCount = await googleLinkedPoolCount();
  } catch (e) {
    console.error("[home] db", e);
    dbError = true;
  }

  const googleLinkedCount = playPoolCount ?? 0;
  const exportReady = googleLinkedCount >= EXPORT_THRESHOLD;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-accent text-sm font-medium tracking-wide uppercase mb-3">
          theappdad.com
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-community-text mb-6">
          Google Play needs 12 testers for 14 days.{" "}
          <span className="text-accent">Solo devs feel that.</span>
        </h1>
        {dbError ? (
          <div className="mb-8">
            <DbMigrationBanner />
          </div>
        ) : null}

        <p className="text-community-muted text-lg leading-relaxed mb-8">
          The App Dads is a members-only group for indie developers working
          through Play&apos;s closed-testing steps together. If you join, you can
          opt in to share the{" "}
          <strong className="text-community-text font-medium">
            Google account email
          </strong>{" "}
          you use for closed testing so we can grow a shared tester pool.
          When enough members have linked Google, any signed-in member of The App Dads can
          download a small, rate-limited CSV from the dashboard to use in Play
          Console. The{" "}
          <Link
            href="/legal/terms"
            className="text-accent underline hover:text-community-text"
          >
            Terms of use
          </Link>{" "}
          and{" "}
          <Link
            href="/legal/privacy"
            className="text-accent underline hover:text-community-text"
          >
            Privacy policy
          </Link>{" "}
          explain how exports, email, and data handling work together.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          <div className="rounded-xl border border-community-border bg-community-surface p-4">
            <p className="text-community-muted text-xs uppercase tracking-wide mb-1">
              The App Dads
            </p>
            <p className="text-2xl font-bold text-community-text">
              {collectiveCount != null ? collectiveCount : "—"}
            </p>
            <p className="text-community-muted text-sm mt-1">
              Members of The App Dads
            </p>
          </div>
          <div className="rounded-xl border border-community-border bg-community-surface p-4">
            <p className="text-community-muted text-xs uppercase tracking-wide mb-1">
              Export unlock
            </p>
            <p className="text-2xl font-bold text-community-text">
              {googleLinkedCount} / {EXPORT_THRESHOLD}
            </p>
            <p className="text-community-muted text-sm mt-1">
              Google-linked members needed before anyone can export
            </p>
          </div>
        </div>

        <div
          className={`mb-10 rounded-xl border p-4 ${
            exportReady
              ? "border-accent/40 bg-accent/10"
              : "border-community-border bg-community-surface"
          }`}
        >
          <p className="text-sm font-medium text-community-text mb-1">
            CSV export
          </p>
          <p className="text-community-muted text-sm">
            {exportReady
              ? "Pool threshold met — signed-in members of The App Dads with Google linked can export (from the dashboard)."
              : "Locked until 15 Google-linked members of The App Dads. Pioneer phase: recruit founders first."}
          </p>
        </div>

        <HomeAuthCtas />

        <p className="text-community-muted text-xs mt-12 leading-relaxed">
          <Link href="https://www.theappdad.com/" className="underline hover:text-community-text">
            ← Back to The App Dad
          </Link>
          {" · "}
          Not affiliated with Google. Play requirements can change — check{" "}
          <a
            href="https://support.google.com/googleplay/android-developer/answer/14151465"
            className="underline hover:text-community-text"
            target="_blank"
            rel="noopener noreferrer"
          >
            official Play Console help
          </a>
          .
        </p>
      </main>
    </>
  );
}
