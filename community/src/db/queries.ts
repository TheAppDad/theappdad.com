import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  isNotNull,
  isNull,
  lte,
  sql,
} from "drizzle-orm";
import { appStoreReports, exportAudit, profiles } from "./schema";
import { getDb } from "./index";

const EXPORT_THRESHOLD = 15;
const CSV_EMAIL_CAP = 25;
const COOLDOWN_DAYS = 7;
/** Days after export before we prompt (and email, if configured) for distribution status. */
const FOLLOWUP_DAYS = 15;

export {
  EXPORT_THRESHOLD,
  CSV_EMAIL_CAP,
  COOLDOWN_DAYS,
  FOLLOWUP_DAYS,
};

export async function ensureProfile(clerkUserId: string) {
  const db = getDb();
  if (!db) return null;

  try {
    await db.insert(profiles).values({ clerkUserId }).onConflictDoNothing();

    const [row] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.clerkUserId, clerkUserId))
      .limit(1);

    return row ?? null;
  } catch (e) {
    console.error("[ensureProfile]", e);
    return null;
  }
}

/** Sync public label from Clerk (username / name) for directory & ticker. */
export async function syncProfileDisplayName(
  clerkUserId: string,
  displayName: string | null
) {
  const db = getDb();
  if (!db) return;
  const safe = displayName?.trim().slice(0, 80) || null;
  try {
    await db.insert(profiles).values({ clerkUserId }).onConflictDoNothing();
    await db
      .update(profiles)
      .set({ displayName: safe })
      .where(eq(profiles.clerkUserId, clerkUserId));
  } catch (e) {
    console.error("[syncProfileDisplayName]", e);
  }
}

export async function incrementProfileTesterScore(
  clerkUserId: string,
  delta: number
) {
  if (!delta) return;
  const db = getDb();
  if (!db) return;
  try {
    await db
      .update(profiles)
      .set({ testerScore: sql`${profiles.testerScore} + ${delta}` })
      .where(eq(profiles.clerkUserId, clerkUserId));
  } catch (e) {
    console.error("[incrementProfileTesterScore]", e);
  }
}

export async function collectiveMemberCount() {
  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(profiles)
    .where(eq(profiles.inCollective, true));

  return Number(row?.n ?? 0);
}

/** In The App Dads (in_collective), finished onboarding, and have a stored Google Play email. */
export async function googleLinkedPoolCount() {
  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(profiles)
    .where(
      and(
        eq(profiles.inCollective, true),
        isNotNull(profiles.onboardingCompletedAt),
        isNotNull(profiles.googlePlayEmail)
      )
    );

  return Number(row?.n ?? 0);
}

export function exportThresholdMet(poolCount: number) {
  return poolCount >= EXPORT_THRESHOLD;
}

export async function syncGooglePlayEmail(
  clerkUserId: string,
  email: string | null | undefined
) {
  const db = getDb();
  if (!db) return;

  const normalized = email?.trim() || null;

  await db.insert(profiles).values({ clerkUserId }).onConflictDoNothing();

  await db
    .update(profiles)
    .set({ googlePlayEmail: normalized })
    .where(eq(profiles.clerkUserId, clerkUserId));
}

export async function getPlayTesterEmailsForCsv(limit: number) {
  const db = getDb();
  if (!db) return null;

  const rows = await db
    .select({ email: profiles.googlePlayEmail })
    .from(profiles)
    .where(
      and(
        eq(profiles.inCollective, true),
        isNotNull(profiles.onboardingCompletedAt),
        isNotNull(profiles.googlePlayEmail)
      )
    )
    .orderBy(asc(profiles.createdAt))
    .limit(limit);

  const emails = rows
    .map((r) => r.email?.trim())
    .filter((e): e is string => Boolean(e && e.includes("@")));

  return emails;
}

export type CsvExportRecord = {
  clerkUserId: string;
  appName: string;
  usernameSnapshot: string;
  exporterEmail: string | null;
};

export async function recordCsvExport(payload: CsvExportRecord) {
  const db = getDb();
  if (!db) throw new Error("Database is not configured.");

  const followupDueAt = new Date();
  followupDueAt.setDate(followupDueAt.getDate() + FOLLOWUP_DAYS);

  await db.insert(exportAudit).values({
    clerkUserId: payload.clerkUserId,
    appName: payload.appName,
    usernameSnapshot: payload.usernameSnapshot,
    exporterEmail: payload.exporterEmail,
    followupDueAt,
    distributionReady: null,
  });

  await incrementProfileTesterScore(payload.clerkUserId, 10);
}

/** Past follow-up due date, user has not answered yet. */
export async function getDueExportFollowups(clerkUserId: string) {
  const db = getDb();
  if (!db) return null;

  const now = new Date();

  return db
    .select()
    .from(exportAudit)
    .where(
      and(
        eq(exportAudit.clerkUserId, clerkUserId),
        isNull(exportAudit.distributionReady),
        isNotNull(exportAudit.followupDueAt),
        lte(exportAudit.followupDueAt, now)
      )
    )
    .orderBy(desc(exportAudit.createdAt));
}

/** Next unanswered follow-up still in the waiting period (countdown). */
export async function getUpcomingExportFollowup(clerkUserId: string) {
  const db = getDb();
  if (!db) return null;

  const now = new Date();

  const [row] = await db
    .select()
    .from(exportAudit)
    .where(
      and(
        eq(exportAudit.clerkUserId, clerkUserId),
        isNull(exportAudit.distributionReady),
        isNotNull(exportAudit.followupDueAt),
        gt(exportAudit.followupDueAt, now)
      )
    )
    .orderBy(asc(exportAudit.followupDueAt))
    .limit(1);

  return row ?? null;
}

/** Most recent CSV export app name for this user (same field as Play pulse form). */
export async function getLatestCsvExportAppName(
  clerkUserId: string
): Promise<string | null> {
  const db = getDb();
  if (!db) return null;

  try {
    const [row] = await db
      .select({ appName: exportAudit.appName })
      .from(exportAudit)
      .where(
        and(
          eq(exportAudit.clerkUserId, clerkUserId),
          isNotNull(exportAudit.appName)
        )
      )
      .orderBy(desc(exportAudit.createdAt))
      .limit(1);

    const name = row?.appName?.trim();
    return name && name.length >= 2 ? name : null;
  } catch (e) {
    console.error("[getLatestCsvExportAppName]", e);
    return null;
  }
}

export async function completeExportFollowup(
  clerkUserId: string,
  exportId: string,
  distributionReady: boolean
) {
  const db = getDb();
  if (!db) return { ok: false as const, error: "Database is not configured." };

  try {
    const result = await db
      .update(exportAudit)
      .set({ distributionReady })
      .where(
        and(
          eq(exportAudit.id, exportId),
          eq(exportAudit.clerkUserId, clerkUserId),
          isNull(exportAudit.distributionReady)
        )
      )
      .returning({ id: exportAudit.id });

    if (!result.length) {
      return {
        ok: false as const,
        error: "Export not found or already completed.",
      };
    }
    await incrementProfileTesterScore(
      clerkUserId,
      distributionReady ? 15 : 5
    );
  } catch (e) {
    console.error("[completeExportFollowup]", e);
    return {
      ok: false as const,
      error: "Database error. Try again or run db:push from the community folder.",
    };
  }

  return { ok: true as const };
}

/** Rows due for reminder email (cron): due date passed, no answer, email not sent yet. */
export async function getExportsNeedingReminderEmail() {
  const db = getDb();
  if (!db) return null;

  const now = new Date();

  return db
    .select()
    .from(exportAudit)
    .where(
      and(
        isNull(exportAudit.distributionReady),
        isNotNull(exportAudit.followupDueAt),
        lte(exportAudit.followupDueAt, now),
        isNull(exportAudit.reminderSentAt),
        isNotNull(exportAudit.exporterEmail)
      )
    );
}

export async function markExportReminderSent(exportId: string) {
  const db = getDb();
  if (!db) return;

  await db
    .update(exportAudit)
    .set({ reminderSentAt: new Date() })
    .where(eq(exportAudit.id, exportId));
}

export async function userExportCountLast7Days(clerkUserId: string) {
  const db = getDb();
  if (!db) return null;

  const since = new Date();
  since.setDate(since.getDate() - COOLDOWN_DAYS);

  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(exportAudit)
    .where(
      and(
        eq(exportAudit.clerkUserId, clerkUserId),
        gte(exportAudit.createdAt, since)
      )
    );

  return Number(row?.n ?? 0);
}

export type OnboardingPayload = {
  buildingSummary: string;
  platforms: "android" | "ios" | "both";
};

export async function completeOnboarding(
  clerkUserId: string,
  payload: OnboardingPayload
) {
  const db = getDb();
  if (!db) return { ok: false as const, error: "Database is not configured." };

  await db.insert(profiles).values({ clerkUserId }).onConflictDoNothing();

  await db
    .update(profiles)
    .set({
      buildingSummary: payload.buildingSummary,
      platforms: payload.platforms,
      onboardingCompletedAt: new Date(),
      inCollective: true,
    })
    .where(eq(profiles.clerkUserId, clerkUserId));

  await incrementProfileTesterScore(clerkUserId, 5);

  return { ok: true as const };
}

export type CommunityPulse = {
  profilesTotal: number;
  onboardingCompleted: number;
  inCollective: number;
  newMembers7d: number;
  playPool: number;
  appsInReview: number;
  appsDistributed: number;
};

/** Aggregate stats for the public /community pulse. */
export async function getCommunityPulse(): Promise<CommunityPulse | null> {
  const db = getDb();
  if (!db) return null;

  try {
    const since7 = new Date();
    since7.setDate(since7.getDate() - 7);

    const [tot] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(profiles);
    const [ob] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(profiles)
      .where(isNotNull(profiles.onboardingCompletedAt));
    const [col] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(profiles)
      .where(eq(profiles.inCollective, true));
    const [nb] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(profiles)
      .where(gte(profiles.createdAt, since7));
    const [pl] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(profiles)
      .where(
        and(
          eq(profiles.inCollective, true),
          isNotNull(profiles.onboardingCompletedAt),
          isNotNull(profiles.googlePlayEmail)
        )
      );

    const statusRows = await db
      .select({
        status: appStoreReports.status,
        n: sql<number>`count(*)::int`,
      })
      .from(appStoreReports)
      .groupBy(appStoreReports.status);

    let appsInReview = 0;
    let appsDistributed = 0;
    for (const r of statusRows) {
      if (r.status === "in_review") appsInReview = Number(r.n);
      if (r.status === "distributed") appsDistributed = Number(r.n);
    }

    return {
      profilesTotal: Number(tot?.n ?? 0),
      onboardingCompleted: Number(ob?.n ?? 0),
      inCollective: Number(col?.n ?? 0),
      newMembers7d: Number(nb?.n ?? 0),
      playPool: Number(pl?.n ?? 0),
      appsInReview,
      appsDistributed,
    };
  } catch (e) {
    console.error("[getCommunityPulse]", e);
    return null;
  }
}

export async function upsertAppStoreReport(
  clerkUserId: string,
  appName: string,
  status: "in_review" | "distributed"
) {
  const db = getDb();
  if (!db) return { ok: false as const, error: "Database is not configured." };

  const now = new Date();

  try {
    await db
      .insert(appStoreReports)
      .values({
        clerkUserId,
        appName,
        status,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [appStoreReports.clerkUserId, appStoreReports.appName],
        set: { status, updatedAt: now },
      });
  } catch (e) {
    console.error("[upsertAppStoreReport]", e);
    return {
      ok: false as const,
      error:
        "Could not save. From the community folder run npm run db:push, then try again.",
    };
  }

  return { ok: true as const };
}

const DIRECTORY_VISIBLE = and(
  eq(profiles.inCollective, true),
  isNotNull(profiles.onboardingCompletedAt)
);

export type PublicDirectoryMember = {
  id: string;
  displayName: string | null;
  testerScore: number;
  buildingSummary: string | null;
  platforms: string | null;
  createdAt: Date;
};

const directorySelect = {
  id: profiles.id,
  displayName: profiles.displayName,
  testerScore: profiles.testerScore,
  buildingSummary: profiles.buildingSummary,
  platforms: profiles.platforms,
  createdAt: profiles.createdAt,
};

/** Latest members of The App Dads for the community ticker (max 5). */
export async function getCommunityTickerMembers(): Promise<
  PublicDirectoryMember[]
> {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select(directorySelect)
      .from(profiles)
      .where(DIRECTORY_VISIBLE)
      .orderBy(desc(profiles.createdAt))
      .limit(5);
  } catch (e) {
    console.error("[getCommunityTickerMembers]", e);
    return [];
  }
}

/** All visible members sorted by tester score (then join date). */
export async function getCommunityLeaderboard(): Promise<
  PublicDirectoryMember[]
> {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select(directorySelect)
      .from(profiles)
      .where(DIRECTORY_VISIBLE)
      .orderBy(desc(profiles.testerScore), asc(profiles.createdAt));
  } catch (e) {
    console.error("[getCommunityLeaderboard]", e);
    return [];
  }
}

const PROFILE_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getPublicProfileById(
  profileId: string
): Promise<PublicDirectoryMember | null> {
  if (!PROFILE_ID_RE.test(profileId)) return null;
  const db = getDb();
  if (!db) return null;
  try {
    const [row] = await db
      .select(directorySelect)
      .from(profiles)
      .where(and(eq(profiles.id, profileId), DIRECTORY_VISIBLE))
      .limit(1);
    return row ?? null;
  } catch (e) {
    console.error("[getPublicProfileById]", e);
    return null;
  }
}
