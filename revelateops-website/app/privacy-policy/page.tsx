import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Revelate Operations',
  description: 'Privacy policy for Revelate Operations LLC. How we collect, use, and protect your information.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-navy">
      {/* Hero */}
      <section className="relative pt-36 sm:pt-40 md:pt-44 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.05em] text-cyan">
            Legal
          </span>
          <h1 className="font-heading mt-5 text-4xl sm:text-5xl font-semibold leading-[1.2] tracking-[-0.02em] text-white">
            Privacy Policy
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
            <h2 className="font-heading text-2xl font-semibold text-white">1. Information We Collect</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              Revelate Operations LLC (&quot;Revelate,&quot; &quot;we,&quot; &quot;us&quot;) collects information you provide directly when you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 pl-4">
              <li>Submit the fit assessment or contact forms on our website</li>
              <li>Schedule a discovery call through our booking system</li>
              <li>Correspond with us via email</li>
              <li>Engage with us as a client under a statement of work</li>
            </ul>
            <p className="font-body text-base leading-relaxed text-white/80">
              This may include your name, email address, company name, phone number, job title, and details about your revenue operations challenges.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">2. Automatically Collected Information</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 pl-4">
              <li>Browser type and version</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referring URL</li>
              <li>Device type and screen resolution</li>
              <li>IP address (anonymized where possible)</li>
            </ul>
            <p className="font-body text-base leading-relaxed text-white/80">
              We use Vercel Analytics and may use third-party analytics services to understand how visitors interact with our site. These tools use cookies or similar technologies.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">3. How We Use Your Information</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 pl-4">
              <li>Respond to your inquiries and schedule consultations</li>
              <li>Provide and improve our consulting services</li>
              <li>Send relevant communications about our services (you can opt out at any time)</li>
              <li>Analyze website usage to improve user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="font-body text-base leading-relaxed text-white/80">
              We do not sell, rent, or trade your personal information to third parties.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">4. Data Sharing</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 pl-4">
              <li><strong className="text-white">Service providers:</strong> Third-party tools that help us operate our business (e.g., Vercel for hosting, Calendly for scheduling, Neon for database services)</li>
              <li><strong className="text-white">Legal requirements:</strong> When required by law, regulation, or legal process</li>
              <li><strong className="text-white">Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">5. Data Security</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              We implement reasonable technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our website is served over HTTPS, and we use industry-standard encryption for data in transit.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">6. Client Confidentiality</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              All client engagement data, including system configurations, business processes, and proprietary information shared during consulting engagements, is treated as strictly confidential and protected under our standard non-disclosure agreements.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">7. Your Rights</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80 pl-4">
              <li>Request access to personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="font-body text-base leading-relaxed text-white/80">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:drew@revelateops.com" className="text-cyan hover:underline">
                drew@revelateops.com
              </a>.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">8. Cookies</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              Our website uses essential cookies to ensure proper functionality. Analytics cookies may be used to understand visitor behavior. You can control cookie settings through your browser preferences.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">9. Changes to This Policy</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our website after changes constitutes acceptance of the revised policy.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-white">10. Contact</h2>
            <p className="font-body text-base leading-relaxed text-white/80">
              For questions about this privacy policy or our data practices, contact:
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
