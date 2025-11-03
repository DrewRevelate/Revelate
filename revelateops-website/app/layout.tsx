import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingBookingButton from "@/components/FloatingBookingButton";
import KeyboardScrollProvider from "@/components/KeyboardScrollProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-heading",
});

const siteUrl = "https://www.revelateops.com";
const siteTitle = "Revelate Operations | RevOps Consulting for Series B Startups";
const siteDescription =
  "Legacy Salesforce modernization for Series B SaaS teams. Fix routing, forecasting, and integrations without rebuilding the entire org.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | Revelate Operations',
  },
  description: siteDescription,
  keywords: [
    'Salesforce modernization',
    'RevOps consulting',
    'Series B SaaS',
    'revenue operations',
    'Salesforce integration',
    'GTM operations',
    'Boston RevOps',
    'remote RevOps consultant',
    'CRM modernization',
    'sales operations'
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: "Revelate Operations",
    images: [
      {
        url: "/og/revelate-hero.png",
        width: 1200,
        height: 630,
        alt: "Revelate Operations Salesforce Modernization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@revelateops",
    creator: "@revelateops",
    title: siteTitle,
    description: siteDescription,
    images: ["/og/revelate-hero.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Revelate Operations",
  url: siteUrl,
  logo: `${siteUrl}/revelate-logo.png`,
  image: `${siteUrl}/og/revelate-hero.png`,
  description: siteDescription,
  areaServed: "United States",
  founder: {
    "@type": "Person",
    name: "Drew Lambert",
  },
  sameAs: ["https://www.linkedin.com/in/drew-lambert/"],
  serviceType: [
    "Salesforce RevOps Modernization",
    "Technical Debt Remediation",
    "Integration Governance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        <KeyboardScrollProvider />
        <a
          href="#differentiators"
          className="skip-link fixed left-4 top-4 z-[999] -translate-y-20 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#080a12] shadow transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-cyan"
        >
          Skip to main content
        </a>
        <Navigation />
        <main role="main">
          {children}
        </main>
        <Footer />
        <FloatingBookingButton />
        <GoogleAnalytics />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
