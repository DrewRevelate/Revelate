import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
  title: siteTitle,
  description: siteDescription,
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
        <a
          href="#symptoms"
          className="skip-link fixed left-4 top-4 z-[999] -translate-y-20 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#080a12] shadow transition focus:translate-y-0 focus:outline-none"
        >
          Skip to content
        </a>
        <Navigation />
        <main role="main">
          {children}
        </main>
        <Footer />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
