import { NextResponse } from "next/server";
import { getExportsNeedingReminderEmail, markExportReminderSent } from "@/db/queries";
import { sendDistributionFollowupEmail } from "@/lib/resendReminder";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function baseUrl() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "http://localhost:3001";
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not set." },
      { status: 503 }
    );
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const rows = await getExportsNeedingReminderEmail();
  if (rows == null) {
    return NextResponse.json(
      { error: "Database unavailable." },
      { status: 503 }
    );
  }

  const dashboardUrl = `${baseUrl()}/dashboard`;
  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const email = row.exporterEmail?.trim();
    const appName = row.appName?.trim() || "your app";
    if (!email) {
      skipped++;
      continue;
    }

    const result = await sendDistributionFollowupEmail({
      to: email,
      appName,
      usernameSnapshot: row.usernameSnapshot,
      dashboardUrl,
    });

    if (result.ok) {
      await markExportReminderSent(row.id);
      sent++;
    } else {
      if (result.error === "Resend is not configured.") {
        skipped++;
      } else {
        errors.push(`${row.id}: ${result.error}`);
      }
    }
  }

  return NextResponse.json({
    processed: rows.length,
    sent,
    skipped,
    errors: errors.slice(0, 10),
  });
}
