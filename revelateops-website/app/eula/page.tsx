import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Revelate Operations',
  description: 'Terms of service for Revelate Operations LLC consulting services and website usage.',
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-navy">
      {/* Hero */}
      <section className="relative pt-36 sm:pt-40 md:pt-44 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.05em] text-cyan">
            Legal
          </span>
          <h1 className="font-heading mt-5 text-4xl sm:text-5xl font-semibold leading-[1.2] tracking-[-0.02em] text-white">
            Terms of Service
          </h1>
          <p className="font-body mt-4 text-lg text-white/70">
            Last updated: January 29, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="relative pb-24 px-4">
        <div className="mx-auto max-w-3xl space-y-10">

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">1. Agreement to Terms</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              By accessing or using the Revelate Operations LLC (&quot;Revelate,&quot; &quot;we,&quot; &quot;us&quot;) website at revelateops.com, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">2. Services</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              Revelate Operations provides revenue operations consulting services, including but not limited to Salesforce architecture, system integration, revenue process optimization, and GTM systems engineering. Consulting engagements are governed by separate statements of work and master service agreements executed between Revelate and the client.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">3. Website Use</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              This website is provided for informational purposes and to facilitate initial contact with potential clients. You agree to use the website only for lawful purposes and in accordance with these terms.
            </p>
            <p className="font-body text-base leading-relaxed text-white/80">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 pl-4">
              <li>Use the website in any way that violates applicable laws or regulations</li>
              <li>Attempt to interfere with the proper operation of the website</li>
              <li>Engage in any data mining, scraping, or similar data collection activities</li>
              <li>Submit false or misleading information through any forms</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">4. Intellectual Property</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              All content on this website, including text, graphics, logos, design elements, and software, is the property of Revelate Operations LLC and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without express written permission.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">5. Consulting Engagements</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              Information provided on this website, including pricing ranges, timelines, and service descriptions, is provided for general informational purposes only. Actual project scope, pricing, and timelines are determined through consultation and documented in a separate statement of work.
            </p>
            <p className="font-body text-base leading-relaxed text-white/80">
              Nothing on this website constitutes a binding offer or contract for consulting services.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">6. Confidentiality</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              We take client confidentiality seriously. Any proprietary information shared during discovery calls, fit assessments, or consulting engagements is treated as confidential. Formal confidentiality protections are established through our standard consulting agreements.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">7. Disclaimer of Warranties</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              This website and its contents are provided &quot;as is&quot; without warranties of any kind, either express or implied. Revelate does not warrant that the website will be uninterrupted, error-free, or free of harmful components.
            </p>
            <p className="font-body text-base leading-relaxed text-white/80">
              Case studies and results described on this website reflect outcomes from specific engagements and are not guarantees of future performance.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">8. Limitation of Liability</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              To the fullest extent permitted by law, Revelate Operations LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use this website.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">9. Third-Party Links</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              This website may contain links to third-party websites or services. We are not responsible for the content, accuracy, or practices of third-party sites. Inclusion of links does not imply endorsement.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">10. Governing Law</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              These terms are governed by and construed in accordance with the laws of the State of New Hampshire, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved in the courts of New Hampshire.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">11. Changes to Terms</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              We reserve the right to modify these terms at any time. Changes will be effective when posted on this page. Your continued use of the website after changes constitutes acceptance of the modified terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">12. Contact</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              For questions about these terms, contact:
            </p>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 space-y-2">
              <p className="text-white font-semibold">Revelate Operations LLC</p>
              <p className="text-white/80">Drew Lambert, Founder</p>
              <p className="text-white/80">
                <a href="mailto:drew@revelateops.com" className="text-cyan hover:underline">
                  drew@revelateops.com
                </a>
              </p>
              <p className="text-white/80">Boston, MA | Remote-first</p>
            </div>
          </div>

          {/* Back link */}
          <div className="pt-8 border-t border-white/10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan transition hover:text-blue"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              Back to homepage
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
