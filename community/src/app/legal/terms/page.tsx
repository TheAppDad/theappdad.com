import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const lastUpdated = "4 April 2026";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 text-community-muted text-sm leading-relaxed space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-community-text mb-2">
            Terms of use — The App Dads community
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
            These terms are a working agreement for the community site at{" "}
            <strong className="text-amber-50">theappdad.com</strong>. Have them
            reviewed by qualified counsel before you rely on them.
          </p>
        </div>

        <p>
          These terms govern your access to and use of the community website and
          related services (including sign-in, onboarding, the member dashboard,
          CSV export tools, directory, and public community stats). Our{" "}
          <Link href="/legal/privacy" className="text-accent hover:underline">
            Privacy policy
          </Link>{" "}
          explains how we handle personal data and is incorporated by reference.
          By creating an account, completing onboarding, or otherwise using the
          services, you agree to these terms and the Privacy policy. If you do not
          agree, do not use the services.
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
              <a href="#service" className="text-accent hover:underline">
                The service
              </a>
            </li>
            <li>
              <a href="#eligibility" className="text-accent hover:underline">
                Eligibility &amp; accounts
              </a>
            </li>
            <li>
              <a href="#tester-pool" className="text-accent hover:underline">
                The App Dads &amp; tester pool
              </a>
            </li>
            <li>
              <a href="#acceptable-use" className="text-accent hover:underline">
                Acceptable use
              </a>
            </li>
            <li>
              <a href="#your-content" className="text-accent hover:underline">
                Your content
              </a>
            </li>
            <li>
              <a href="#third-parties" className="text-accent hover:underline">
                Third-party services
              </a>
            </li>
            <li>
              <a href="#disclaimers" className="text-accent hover:underline">
                Disclaimers
              </a>
            </li>
            <li>
              <a href="#liability" className="text-accent hover:underline">
                Limitation of liability
              </a>
            </li>
            <li>
              <a href="#indemnity" className="text-accent hover:underline">
                Indemnity
              </a>
            </li>
            <li>
              <a href="#termination" className="text-accent hover:underline">
                Suspension &amp; termination
              </a>
            </li>
            <li>
              <a href="#changes" className="text-accent hover:underline">
                Changes
              </a>
            </li>
            <li>
              <a href="#law" className="text-accent hover:underline">
                Governing law
              </a>
            </li>
            <li>
              <a href="#contact" className="text-accent hover:underline">
                Contact
              </a>
            </li>
          </ol>
        </nav>

        <section id="service" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            1. The service
          </h2>
          <p>
            The App Dads community helps independent developers coordinate around
            Google Play closed-testing requirements (for example, minimum testers
            and duration). Features may include: member profiles, a voluntary
            Google-linked tester pool, rate-limited CSV exports for use in Play
            Console, optional follow-up reminders, a member directory with
            limited public fields, and aggregate community statistics. We may add,
            change, or remove features at any time.
          </p>
        </section>

        <section id="eligibility" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            2. Eligibility &amp; accounts
          </h2>
          <p>
            You must be old enough to enter a binding contract where you live
            (typically 18, or the age of digital consent in your country) to use
            the services. You agree to provide accurate information during
            onboarding and to keep your sign-in credentials secure. We use{" "}
            <strong className="text-community-text">Clerk</strong> (or a
            successor) for authentication; your use of Clerk is also subject to
            Clerk&apos;s terms. You are responsible for activity under your
            account unless you notify us of unauthorized access.
          </p>
        </section>

        <section id="tester-pool" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            3. The App Dads &amp; tester pool
          </h2>
          <p>
            <strong className="text-community-text">Shared emails.</strong> If you
            join The App Dads tester pool, the Google account email we store for Play
            closed testing may appear in CSV files that{" "}
            <strong className="text-community-text">other members download</strong>
            . Those members may import addresses into Google Play Console or
            compatible tools. You accept that risk by staying in the pool and
            checking the onboarding consent.
          </p>
          <p>
            <strong className="text-community-text">Permitted use of exports.</strong>{" "}
            You may use downloaded CSVs{" "}
            <strong className="text-community-text">
              only to invite testers for legitimate closed testing on Google Play
            </strong>{" "}
            in line with Google&apos;s policies and applicable law. You must not
            use the list for unsolicited marketing, harassment, resale,
            “review farming,” or any purpose unrelated to the closed-testing
            workflow The App Dads is built for.
          </p>
          <p>
            <strong className="text-community-text">Your duties to testers.</strong>{" "}
            You are solely responsible for your apps, your Play Console
            configuration, tester communications, data you collect from testers,
            and compliance with Google&apos;s developer policies and privacy
            obligations. Other members&apos; emails are not an endorsement of
            your app.
          </p>
          <p>
            <strong className="text-community-text">Rate limits &amp; fairness.</strong>{" "}
            Technical limits (for example, export cooldowns) exist to protect the
            pool. You must not attempt to bypass them or scrape the site in ways
            that harm the service or other members.
          </p>
        </section>

        <section id="acceptable-use" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            4. Acceptable use
          </h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 pl-1">
            <li>
              Use the services for anything unlawful, fraudulent, or harmful;
            </li>
            <li>
              Manipulate, coerce, or incentivize app store reviews or ratings
              through tester lists or The App Dads;
            </li>
            <li>
              Harass, threaten, or discriminate against members or testers;
            </li>
            <li>
              Upload malware, probe or attack our infrastructure, or overload the
              service;
            </li>
            <li>
              Misrepresent your identity, your apps, or your relationship to The
              App Dads;
            </li>
            <li>
              Reverse engineer or attempt to extract bulk data except through
              features we expressly provide.
            </li>
          </ul>
        </section>

        <section id="your-content" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            5. Your content
          </h2>
          <p>
            You retain rights to content you submit (for example, descriptions of
            what you are building). You grant us a non-exclusive, worldwide,
            royalty-free licence to host, display, and process that content solely
            to operate and improve the services (including the directory and
            aggregate stats). You confirm you have the right to grant that
            licence.
          </p>
        </section>

        <section id="third-parties" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            6. Third-party services
          </h2>
          <p>
            The services depend on third parties (for example Google accounts,
            Google Play Console, Clerk, hosting, and email delivery). Their terms
            and policies apply to your use of those products. We are not
            responsible for third-party services, store approval decisions, or
            enforcement actions by platforms.
          </p>
        </section>

        <section id="disclaimers" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            7. Disclaimers
          </h2>
          <p>
            The services are provided{" "}
            <strong className="text-community-text">
              &quot;as is&quot; and &quot;as available&quot;
            </strong>
            . We disclaim all warranties to the fullest extent permitted by law,
            including implied warranties of merchantability, fitness for a
            particular purpose, and non-infringement. We do not guarantee
            uninterrupted access, a minimum number of testers, Play approval, or
            any business outcome. Nothing on the site is legal, tax, or
            professional advice.
          </p>
        </section>

        <section id="liability" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            8. Limitation of liability
          </h2>
          <p>
            To the fullest extent permitted by applicable law, neither The App
            Dads, its operator, nor its contributors will be liable for any
            indirect, incidental, special, consequential, or punitive damages, or
            any loss of profits, data, goodwill, or business opportunities,
            arising from your use of the services or reliance on exports or member
            interactions—even if we were advised such damages were possible.
          </p>
          <p>
            To the fullest extent permitted by law, our total liability for any
            claim arising out of these terms or the services is limited to the
            greater of{" "}
            <strong className="text-community-text">
              fifty pounds sterling (£50)
            </strong>{" "}
            or the amount you paid us for the services in the twelve months before
            the claim (if any). Some jurisdictions do not allow certain
            limitations; in those cases our liability is limited to the minimum
            permitted by law.
          </p>
        </section>

        <section id="indemnity" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            9. Indemnity
          </h2>
          <p>
            You will defend and indemnify us against any claims, damages,
            losses, and expenses (including reasonable legal fees) arising from
            your use of the services, your apps, your misuse of CSV exports or
            tester data, your violation of these terms, or your violation of
            third-party rights—except to the extent caused by our wilful
            misconduct.
          </p>
        </section>

        <section id="termination" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            10. Suspension &amp; termination
          </h2>
          <p>
            We may suspend or terminate access if you breach these terms, if we
            must comply with law, or if we wind down The App Dads. You may stop
            using the services at any time. Provisions that by their nature should
            survive (including liability limits, indemnity, and governing law)
            will survive termination.
          </p>
        </section>

        <section id="changes" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            11. Changes
          </h2>
          <p>
            We may update these terms. We will change the &quot;Last updated&quot;
            date and, for material changes, provide reasonable notice (for example
            on the site or by email). If you continue using the services after the
            effective date, you accept the updated terms. If you do not agree, you
            must stop using the services.
          </p>
        </section>

        <section id="law" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            12. Governing law
          </h2>
          <p>
            These terms are governed by the{" "}
            <strong className="text-community-text">
              laws of England and Wales
            </strong>
            , without regard to conflict-of-law rules. The courts of England and
            Wales have non-exclusive jurisdiction, except that if you are a
            consumer resident in the EEA, UK, or another country with mandatory
            protections, you may also have rights to bring proceedings where you
            live.
          </p>
        </section>

        <section id="contact" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-semibold text-community-text">
            13. Contact
          </h2>
          <p>
            Questions about these terms:{" "}
            <a
              href="mailto:theappdad@theappdad.com"
              className="text-accent hover:underline"
            >
              theappdad@theappdad.com
            </a>.
          </p>
        </section>

        <p className="pt-4 border-t border-community-border">
          <Link href="/" className="text-accent hover:underline">
            ← Home
          </Link>
          {" · "}
          <Link href="/legal/privacy" className="text-accent hover:underline">
            Privacy policy
          </Link>
        </p>
      </main>
    </>
  );
}
