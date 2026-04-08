import { NextResponse } from "next/server";
import { getDb } from "@/db/index";
import {
  CSV_EMAIL_CAP,
  ensureProfile,
  EXPORT_THRESHOLD,
  getPlayTesterEmailsForCsv,
  googleLinkedPoolCount,
  recordCsvExport,
  syncGooglePlayEmail,
  userExportCountLast7Days,
} from "@/db/queries";
import type { ClerkUser } from "@/lib/getCurrentUserSafe";
import { getCurrentUserSafe } from "@/lib/getCurrentUserSafe";
import { formatTesterCsv } from "@/lib/testerCsv";

function googleAccountFromUser(user: ClerkUser) {
  return user.externalAccounts?.find(
    (a) =>
      a.provider === "google" ||
      a.provider === "oauth_google" ||
      (a.provider as string)?.includes("google")
  );
}

export async function POST(req: Request) {
  if (!getDb()) {
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 503 }
    );
  }

  const { user, authError } = await getCurrentUserSafe();
  if (authError) {
    return NextResponse.json(
      { error: "Sign-in service unavailable. Check Clerk configuration." },
      { status: 503 }
    );
  }
  if (!user?.id) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const userId = user.id;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
  }

  const appNameRaw =
    body && typeof body === "object" && "appName" in body
      ? (body as { appName?: unknown }).appName
      : undefined;

  const appName =
    typeof appNameRaw === "string" ? appNameRaw.trim().slice(0, 200) : "";

  if (appName.length < 2) {
    return NextResponse.json(
      {
        error:
          "Add your app’s display name (at least 2 characters) before downloading.",
      },
      { status: 400 }
    );
  }

  const google = googleAccountFromUser(user);
  if (!google?.emailAddress) {
    return NextResponse.json(
      {
        error:
          "Link a Google account in Clerk (same one you use for Play Console) before exporting.",
      },
      { status: 403 }
    );
  }

  await syncGooglePlayEmail(userId, google.emailAddress);

  const profile = await ensureProfile(userId);
  if (!profile) {
    return NextResponse.json(
      {
        error:
          "Could not load your profile. Check DATABASE_URL, run npm run db:push from the community folder, and try again.",
      },
      { status: 503 }
    );
  }
  if (!profile.inCollective || !profile.onboardingCompletedAt) {
    return NextResponse.json(
      {
        error:
          "Complete onboarding and join The App Dads before exporting.",
      },
      { status: 403 }
    );
  }

  const pool = await googleLinkedPoolCount();
  if (pool == null) {
    return NextResponse.json(
      { error: "Could not read pool size." },
      { status: 503 }
    );
  }

  if (pool < EXPORT_THRESHOLD) {
    return NextResponse.json(
      {
        error: `Export unlocks when at least ${EXPORT_THRESHOLD} members have linked Google and synced to the pool (currently ${pool}).`,
      },
      { status: 403 }
    );
  }

  const recentExports = await userExportCountLast7Days(userId);
  if (recentExports == null) {
    return NextResponse.json(
      { error: "Could not verify export cooldown." },
      { status: 503 }
    );
  }
  if (recentExports > 0) {
    return NextResponse.json(
      {
        error:
          "You already exported within the last 7 days. Try again after the cooldown.",
      },
      { status: 429 }
    );
  }

  const emails = await getPlayTesterEmailsForCsv(CSV_EMAIL_CAP);
  if (emails == null) {
    return NextResponse.json(
      { error: "Could not load tester emails." },
      { status: 503 }
    );
  }

  if (emails.length === 0) {
    return NextResponse.json(
      {
        error:
          "No emails available yet. Members need Google linked and a dashboard visit to sync emails into the pool.",
      },
      { status: 409 }
    );
  }

  const usernameSnapshot =
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    user.id;
  const exporterEmail =
    user.primaryEmailAddress?.emailAddress ??
    google.emailAddress ??
    null;

  try {
    await recordCsvExport({
      clerkUserId: userId,
      appName,
      usernameSnapshot,
      exporterEmail,
    });
  } catch (e) {
    console.error("[api/export/csv] recordCsvExport", e);
    return NextResponse.json(
      {
        error:
          "Could not record export. From the community folder run npm run db:push.",
      },
      { status: 503 }
    );
  }

  const csvBody = formatTesterCsv(emails);
  const filename = `app-dads-testers-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csvBody, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
