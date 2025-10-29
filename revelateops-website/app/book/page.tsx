import CalendlyEmbed from '@/components/CalendlyEmbed';

export const metadata = {
  title: 'Book a Discovery Call | Revelate Operations',
  description: 'Schedule a discovery call with Drew Lambert to discuss your Salesforce challenges and see if modernizing your existing org is the right move.',
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Book Your Discovery Call
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Let's discuss your Salesforce challenges and explore how modernizing the org you already have can help.
            No pressure, no sales pitch—just an honest conversation about whether we're a good fit.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Info */}
          <div className="space-y-8">
            <div className="p-8 border border-border rounded-2xl bg-white">
              <h2 className="text-2xl font-bold mb-4 text-foreground">What to Expect</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-magenta/10 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-magenta" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">30-Minute Call</h3>
                    <p className="text-muted">Quick but thorough discussion of your current challenges and goals</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-magenta/10 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-magenta" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">No Sales Pressure</h3>
                    <p className="text-muted">Honest assessment of whether I can help. If we're not a fit, I'll tell you upfront</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-magenta/10 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-magenta" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Clear Next Steps</h3>
                    <p className="text-muted">If we decide to work together, I'll outline recommended approach and pricing</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-8 border border-border rounded-2xl bg-white">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Come Prepared</h2>
              <p className="text-muted mb-4">
                To make the most of our time together, it's helpful if you can briefly describe:
              </p>
              <ul className="space-y-2 text-muted">
                <li className="flex items-start gap-3">
                  <span className="text-magenta">•</span>
                  <span>Your current Salesforce challenges (what's breaking as you scale?)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-magenta">•</span>
                  <span>What vendors or consultants have recommended (if applicable)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-magenta">•</span>
                  <span>Your current tech stack and integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-magenta">•</span>
                  <span>Timeline and budget constraints</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border border-border rounded-2xl bg-gradient-to-br from-cyan/5 to-transparent">
              <p className="text-muted">
                <strong className="text-foreground">Note:</strong> I manage 2-3 active projects at a time to ensure
                quality and deep focus. If my calendar is full, I'll recommend other qualified Salesforce consultants.
              </p>
            </div>
          </div>

          {/* Right Column - Calendly Embed */}
          <div className="lg:sticky lg:top-24">
            <div className="p-4 border border-border rounded-2xl bg-white">
              <CalendlyEmbed />
            </div>
            <p className="text-center text-muted text-sm mt-4">
              All times shown in your local timezone
            </p>
          </div>
        </div>

        {/* Alternative Contact */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Prefer Email?</h3>
          <p className="text-muted mb-4">
            Not ready to schedule a call yet? Have questions first? Send me an email and I'll get back to you within 24 hours.
          </p>
          <a
            href="mailto:drew@revelateops.com"
            className="inline-block px-6 py-3 border-2 border-magenta rounded-lg text-magenta font-semibold hover:bg-magenta/5 transition-colors"
          >
            drew@revelateops.com
          </a>
        </div>
      </div>
    </div>
  );
}
