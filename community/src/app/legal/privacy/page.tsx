import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const lastUpdated = "4 April 2026";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 text-community-muted text-sm leading-relaxed space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-community-text mb-2">
            Privacy policy — The App Dads community
          </h1>
          <p className="text-xs uppercase tracking-wide text-community-muted">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-100 text-sm"
          role="note"
        >
          <p className="font-medium text-amber-50">Draft — not legal advice</p>
          <p className="mt-1 text-amber-100/90">
            This is a working privacy policy for{" "}
            <strong className="text-amber-50">theappdad.com</strong> — The App Dads
            member site and CSV tools. Have it reviewed by qualified counsel before
            you rely on it for compliance.
          </p>
        </div>

        <p>
          This policy describes how we collect, use, store, and share personal
          information when you use the community website and related services
          (sign-in, onboarding, dashboard, CSV export, member directory, and
          public community stats). By using the services, you acknowledge this
          policy. If you do not agree, do not use the services.
        </p>

        <nav
          className="rounded-xl border border-community-border bg-community-surface/50 p-4"
          aria-label="On this page"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-community-text mb-2">
            On this page
          </p>
          <ol className="list-decimal list-inside space-y-1 text-community-text">
            <li>
              <a href="#who-we-are" className="text-accent hover:underline">
                Who we are
              </a>
            </li>
            <li>
              <a href="#children" className="text-accent hover:underline">
                Children
              </a>
            </li>
            <li>
              <a href="#what-we-collect" className="text-accent hover:underline">
                What we collect
              </a>
            </li>
            <li>
              <a href="#how-we-use" className="text-accent hover:underline">
                How we use information
              </a>
            </li>
            <li>
              <a href="#legal-bases" className="text-accent hover:underline">
                Legal bases (EEA / UK)
              </a>
            </li>
            <li>
              <a href="#sharing" className="text-accent hover:underline">
                Sharing & other members
              </a>
            </li>
            <li>
              <a href="#processors" className="text-accent hover:underline">
                Service providers
              </a>
            </li>
            <li>
              <a href="#transfers" className="text-accent hover:underline">
                International transfers
              </a>
            </li>
            <li>
              <a href="#retention" className="text-accent hover:underline">
                Retention
              </a>
            </li>
            <li>
              <a href="#your-rights" className="text-accent hover:underline">
                Your rights
              </a>
            </li>
            <li>
              <a href="#security" className="text-accent hover:underline">
                Security
              </a>
            </li>
            <li>
              <a href="#cookies" className="text-accent hover:underline">
                Cookies & analytics
              </a>
            </li>
            <li>
              <a href="#changes" className="text-accent hover:underline">
                Changes
              </a>
            </li>
            <li>
              <a href="#contact" className="text-accent hover:underline">
                Contact
              </a>
            </li>
          </ol>
        </nav>

        <section id="who-we-are" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            1. Who we are
          </h2>
          <p>
            The community services are operated in connection with{" "}
            <strong className="text-community-text">The App Dads</strong> and{" "}
            <strong className="text-community-text">theappdad.com</strong>. For
            privacy requests, contact:{" "}
            <a
              href="mailto:theappdad@theappdad.com"
              className="text-accent hover:underline"
            >
              theappdad@theappdad.com
            </a>.
          </p>
        </section>

        <section id="children" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            2. Children
          </h2>
          <p>
            The services are not directed at children under 13 (or the minimum age
            required in your country to consent to data processing). We do not
            knowingly collect personal information from children. If you believe
            we have, contact us and we will take steps to delete it.
          </p>
        </section>

        <section id="what-we-collect" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            3. What we collect
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-1">
            <li>
              <strong className="text-community-text">Account &amp; auth.</strong>{" "}
              We use{" "}
              <strong className="text-community-text">Clerk</strong> for
              authentication. Clerk processes identifiers such as your user ID,
              email address(es), and linked social accounts (e.g. Google) according
              to Clerk&apos;s privacy policy. We do not receive your Google
              password.
            </li>
            <li>
              <strong className="text-community-text">Profile &amp; onboarding.</strong>{" "}
              When you join The App Dads, we store information you submit, such
              as a short description of what you are building and platform choice
              (e.g. Android / iOS / both), along with timestamps (e.g. when
              onboarding was completed).
            </li>
            <li>
              <strong className="text-community-text">
                Google Play / tester email (optional but required for pool export).
              </strong>{" "}
              If you link Google via Clerk, we may store the Google account email
              address associated with Play closed testing so it can be included in
              The App Dads tester pool and CSV exports. This is separate from
              your sign-in email if they differ.
            </li>
            <li>
              <strong className="text-community-text">Display name (directory).</strong>{" "}
              We sync a public-facing label for the member directory and community
              pages (e.g. Clerk username, name fields, or email local-part when
              needed as a fallback). We do not show your full email address on
              public profile pages.
            </li>
            <li>
              <strong className="text-community-text">CSV export &amp; audit log.</strong>{" "}
              When a member exports a tester CSV, we record metadata such as who
              exported, when, app name, and related snapshots needed for cooldowns,
              follow-up prompts, and optional reminder emails.
            </li>
            <li>
              <strong className="text-community-text">Community pulse (self-reported).</strong>{" "}
              If you submit app store status (e.g. in review vs live), we store
              that report per app name for aggregate stats on the public Community
              page.
            </li>
            <li>
              <strong className="text-community-text">Tester score.</strong>{" "}
              We store a numeric score derived from in-product actions (e.g.
              onboarding, exports, follow-up responses) for leaderboards.
            </li>
            <li>
              <strong className="text-community-text">Technical &amp; security.</strong>{" "}
              Our hosting provider and infrastructure may process IP addresses,
              device/browser type, timestamps, and similar data in server logs for
              security, debugging, and reliability.
            </li>
            <li>
              <strong className="text-community-text">Support.</strong> If you
              email us, we keep the content of your message and our replies for as
              long as needed to help you and maintain records.
            </li>
          </ul>
        </section>

        <section id="how-we-use" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            4. How we use information
          </h2>
          <p>We use the information above to:</p>
          <ul className="list-disc list-inside space-y-2 pl-1">
            <li>Provide and operate sign-in, onboarding, and the dashboard;</li>
            <li>
              Build and maintain the Google-linked tester pool and enforce export
              rules (thresholds, cooldowns);
            </li>
            <li>
              Generate CSV files for Play Console closed testing when you request
              an export;
            </li>
            <li>
              Run optional follow-up reminders (e.g. email) about distribution
              status where configured;
            </li>
            <li>
              Show aggregate community stats and a voluntary member directory;
            </li>
            <li>Improve the product, fix errors, and protect against abuse;</li>
            <li>Comply with law and enforce our terms.</li>
          </ul>
        </section>

        <section id="legal-bases" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            5. Legal bases (EEA / UK)
          </h2>
          <p>
            If you are in the European Economic Area, United Kingdom, or similar
            jurisdictions, we rely on one or more of:{" "}
            <strong className="text-community-text">contract</strong> (to provide
            the services you asked for),{" "}
            <strong className="text-community-text">legitimate interests</strong>{" "}
            (e.g. securing the site, understanding usage, preventing fraud—balanced
            against your rights),{" "}
            <strong className="text-community-text">consent</strong> where we ask
            for it (e.g. onboarding checkboxes), and{" "}
            <strong className="text-community-text">legal obligation</strong>{" "}
            where required.
          </p>
        </section>

        <section id="sharing" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            6. Sharing &amp; other members
          </h2>
          <p>
            <strong className="text-community-text">
              We do not sell your personal information.
            </strong>
          </p>
          <p>
            <strong className="text-community-text">Other members of The App Dads.</strong>{" "}
            The core purpose of The App Dads is to share a pool of Google
            account emails for closed testing. When another member downloads a CSV
            you are eligible for,{" "}
            <strong className="text-community-text">
              your Google Play email address (as stored in our database) may
              appear in that file
            </strong>{" "}
            alongside other members&apos; emails. That recipient may import those
            addresses into Google Play Console or other tools under their own
            responsibility. You should only stay in The App Dads if you accept
            that risk and use case.
          </p>
          <p>
            <strong className="text-community-text">Public directory.</strong>{" "}
            Onboarded members of The App Dads may appear on community pages with the
            limited fields described in this policy (e.g. display name, what they
            are building, platforms, join date, tester score—not your Google email).
          </p>
          <p>
            <strong className="text-community-text">Service providers.</strong> See
            the next section. We may also disclose information if required by law
            or to protect rights, safety, and integrity of the services.
          </p>
        </section>

        <section id="processors" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            7. Service providers
          </h2>
          <p>
            We use vendors that process data on our behalf, for example:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-1">
            <li>
              <strong className="text-community-text">Clerk</strong> —
              authentication and user management;
            </li>
            <li>
              <strong className="text-community-text">Neon</strong> (or your
              configured host) — database for profiles and logs;
            </li>
            <li>
              <strong className="text-community-text">Vercel</strong> (or similar) —
              hosting and serverless functions;
            </li>
            <li>
              <strong className="text-community-text">Resend</strong> (if enabled)
              — transactional email for follow-up reminders.
            </li>
          </ul>
          <p>
            Each provider has its own privacy policy governing how they handle
            data they process for us.
          </p>
        </section>

        <section id="transfers" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            8. International transfers
          </h2>
          <p>
            We and our vendors may process data in the United States, European
            Union, United Kingdom, India, or other countries where we or they
            operate. Where required, we rely on appropriate safeguards (such as
            standard contractual clauses) or other lawful transfer mechanisms.
          </p>
        </section>

        <section id="retention" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            9. Retention
          </h2>
          <p>
            We keep information only as long as needed for the purposes above,
            unless a longer period is required by law. Export and follow-up
            records may be kept for accountability and product logic (e.g. cooldowns)
            even after you stop exporting. When data is no longer needed, we
            delete or anonymize it where feasible.
          </p>
        </section>

        <section id="your-rights" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            10. Your rights
          </h2>
          <p>
            Depending on where you live, you may have the right to access, correct,
            delete, or port your personal data, and to object to or restrict certain
            processing. You may also withdraw consent where processing is
            consent-based. To exercise these rights, contact us at the email
            below. You may also lodge a complaint with your local data protection
            authority.
          </p>
          <p>
            Some processing is required to run The App Dads (e.g. if you remain a
            member, pool-related data may be needed until you leave or we delete
            your account in line with our procedures).
          </p>
        </section>

        <section id="security" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            11. Security
          </h2>
          <p>
            We use reasonable technical and organizational measures to protect
            information (e.g. access controls, encryption in transit where
            configured by providers). No method of transmission or storage is 100%
            secure.
          </p>
        </section>

        <section id="cookies" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            12. Cookies &amp; analytics
          </h2>
          <p>
            Clerk and our hosting stack may use cookies or similar technologies
            required for sign-in and session management. We do not use third-party
            advertising cookies on this community app as of the last updated date
            above; if we add analytics (e.g. privacy-friendly or mainstream
            analytics), we will update this policy and, where required, obtain
            consent.
          </p>
        </section>

        <section id="changes" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            13. Changes
          </h2>
          <p>
            We may update this policy from time to time. We will change the
            &quot;Last updated&quot; date and, for material changes, take additional
            steps such as a notice on the site or email where appropriate.
            Continued use after the effective date means you accept the updated
            policy.
          </p>
        </section>

        <section id="contact" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            14. Contact
          </h2>
          <p>
            Questions or requests about this policy or your data:{" "}
            <a
              href="mailto:theappdad@theappdad.com"
              className="text-accent hover:underline"
            >
              theappdad@theappdad.com
            </a>
          </p>
        </section>

        <p className="pt-4 border-t border-community-border">
          <Link href="/" className="text-accent hover:underline">
            ← Home
          </Link>
          {" · "}
          <Link href="/legal/terms" className="text-accent hover:underline">
            Terms of use
          </Link>
        </p>
      </main>
    </>
  );
}
