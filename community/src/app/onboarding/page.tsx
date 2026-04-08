import Link from "next/link";
import { redirect } from "next/navigation";
import { ClerkAuthErrorBanner } from "@/components/ClerkAuthErrorBanner";
import { DbMigrationBanner } from "@/components/DbMigrationBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { OnboardingForm } from "@/components/OnboardingForm";
import { getDb } from "@/db/index";
import { ensureProfile, syncProfileDisplayName } from "@/db/queries";
import { clerkPublicDisplayName } from "@/lib/clerkDisplayName";
import { getCurrentUserSafe } from "@/lib/getCurrentUserSafe";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { user, authError } = await getCurrentUserSafe();

  if (authError) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
          <h1 className="text-2xl font-bold text-community-text mb-2">
            Join The App Dads
          </h1>
          <ClerkAuthErrorBanner />
        </main>
      </>
    );
  }

  if (!user?.id) {
    redirect("/sign-in");
  }

  const dbConfigured = Boolean(getDb());
  const profile = await ensureProfile(user.id);
  await syncProfileDisplayName(user.id, clerkPublicDisplayName(user));
  if (profile?.onboardingCompletedAt) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
          {!dbConfigured ? (
            <div className="mb-6">
              <DbMigrationBanner />
            </div>
          ) : null}
          <h1 className="text-2xl font-bold text-community-text mb-2">
            You&apos;re set
          </h1>
          <p className="text-community-muted text-sm mb-6">
            Onboarding is complete. Head to the dashboard for exports and
            updates.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex rounded-xl bg-accent px-5 py-2.5 font-semibold text-white hover:bg-accent-hover transition-colors"
          >
            Go to dashboard
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        {!dbConfigured ? (
          <div className="mb-6">
            <DbMigrationBanner />
          </div>
        ) : null}
        <h1 className="text-2xl font-bold text-community-text mb-2">
          Join The App Dads
        </h1>
        <p className="text-community-muted text-sm mb-8">
          Tell us what you&apos;re building, confirm the agreements, and
          we&apos;ll mark you as a member of The App Dads. Username stays in Clerk;
          Google linking for Play is optional but needed later for CSV export.
        </p>
        <OnboardingForm />
        <Link
          href="/dashboard"
          className="inline-block mt-8 text-community-muted text-sm hover:text-community-text"
        >
          ← Back to dashboard
        </Link>
      </main>
    </>
  );
}
