type SendResult = { ok: true } | { ok: false; error: string };

/**
 * Optional Resend transactional email. No-op without RESEND_API_KEY.
 */
export async function sendDistributionFollowupEmail(params: {
  to: string;
  appName: string;
  usernameSnapshot: string | null;
  dashboardUrl: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!key || !from) {
    return { ok: false, error: "Resend is not configured." };
  }

  const subject = `App Dads: distribution check-in — ${params.appName}`;
  const text = `Hi${params.usernameSnapshot ? ` @${params.usernameSnapshot}` : ""},

About 15 days ago you downloaded a Play tester CSV for "${params.appName}".

Please sign in and confirm whether the app was ready for distribution:
${params.dashboardUrl}

— The App Dads`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: params.to,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return { ok: false, error: errText || res.statusText };
  }

  return { ok: true };
}
