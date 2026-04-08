import { NextResponse } from "next/server";
import { completeExportFollowup } from "@/db/queries";
import { getAuthSafe } from "@/lib/getCurrentUserSafe";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const { userId, authError } = await getAuthSafe();
  if (authError) {
    return NextResponse.json(
      { error: "Sign-in service unavailable." },
      { status: 503 }
    );
  }
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const { exportId, distributionReady } = body as {
    exportId?: unknown;
    distributionReady?: unknown;
  };

  if (typeof exportId !== "string" || !UUID_RE.test(exportId)) {
    return NextResponse.json({ error: "Invalid export id." }, { status: 400 });
  }

  if (typeof distributionReady !== "boolean") {
    return NextResponse.json(
      { error: "distributionReady must be a boolean." },
      { status: 400 }
    );
  }

  const result = await completeExportFollowup(
    userId,
    exportId,
    distributionReady
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
