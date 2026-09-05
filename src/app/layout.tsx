import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Gstaad Cricket Club | Cricket for Our Community",
    template: "%s | Gstaad Cricket Club",
  },
  description:
    "Gstaad Cricket Club welcomes children, adults, families and beginners. Join our free Cricket Festival at Ebnit School on 26 September 2026.",
  keywords: [
    "Gstaad Cricket Club",
    "Gstaad Cricket",
    "Cricket Switzerland",
    "Alpine Cricket",
    "Gstaad Cricket Festival 2026",
    "Cricket Bernese Oberland",
    "Sathya Narayanan",
    "Swiss Cricket Club",
  ],
  authors: [{ name: "Gstaad Cricket Club" }],
  creator: "Gstaad Cricket Club",
  publisher: "Gstaad Cricket Club",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_CH",
    url: "https://gstaadcricketclub.ch",
    siteName: "Gstaad Cricket Club",
    title: "Gstaad Cricket Club | Cricket for Our Community",
    description:
      "A free day of cricket for children, adults, families and complete beginners in Gstaad, Switzerland.",
    images: [
      {
        url: "/gstaad-cricket-club-crest.png",
        width: 800,
        height: 800,
        alt: "Gstaad Cricket Club Official Crest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gstaad Cricket Club | Cricket for Our Community",
    description:
      "A free day of cricket for children, adults, families and complete beginners in Gstaad, Switzerland.",
    images: ["/gstaad-cricket-club-crest.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { LanguageProvider } from "@/shared/i18n/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SportsClub & SportsEvent Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SportsClub",
        "@id": "https://gstaadcricketclub.ch/#organization",
        "name": "Gstaad Cricket Club",
        "url": "https://gstaadcricketclub.ch",
        "logo": "https://gstaadcricketclub.ch/gstaad-cricket-club-crest.png",
        "sport": "Cricket",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Ebnitstrasse 28",
          "addressLocality": "Gstaad",
          "postalCode": "3780",
          "addressCountry": "CH"
        },
        "memberOf": {
          "@type": "SportsOrganization",
          "name": "Cricket Switzerland"
        }
      },
      {
        "@type": "SportsEvent",
        "@id": "https://gstaadcricketclub.ch/#festival",
        "name": "Gstaad Cricket Festival 2026",
        "description": "A free day of cricket for children, adults, families and complete beginners in Gstaad.",
        "startDate": "2026-09-26T11:00:00+02:00",
        "endDate": "2026-09-26T18:00:00+02:00",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Place",
          "name": "Ebnit School",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Ebnitstrasse 28",
            "addressLocality": "Gstaad",
            "postalCode": "3780",
            "addressCountry": "CH"
          }
        },
        "isAccessibleForFree": true,
        "organizer": {
          "@id": "https://gstaadcricketclub.ch/#organization"
        }
      }
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/gstaad-cricket-club-crest.png" type="image/png" />
        <link rel="preload" href="/gstaad-cricket-club-crest.png" as="image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col selection:bg-[var(--gold)] selection:text-[var(--green-dark)]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
