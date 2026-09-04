import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Gstaad Cricket Club | Tradition, Sportsmanship, and Alpine Cricket",
    template: "%s | Gstaad Cricket Club",
  },
  description:
    "Gstaad Cricket Club in the Bernese Oberland of Switzerland. Join our annual Alpine Trophy, junior clinics, and community cricket.",
  keywords: [
    "Gstaad Cricket Club",
    "Gstaad Cricket",
    "Alpine Cricket Trophy",
    "Cricket Switzerland",
    "Alpine Sports Gstaad",
    "Bernese Oberland Cricket",
    "Sathya Narayanan",
  ],
  authors: [{ name: "Gstaad Cricket Club" }],
  creator: "Gstaad Cricket Club",
  publisher: "Gstaad Cricket Club",
  openGraph: {
    type: "website",
    locale: "en_CH",
    url: "https://gstaadcricketclub.ch",
    siteName: "Gstaad Cricket Club",
    title: "Gstaad Cricket Club | Cricket in the Bernese Oberland",
    description:
      "Tradition, sportsmanship, and high-altitude alpine cricket in Gstaad, Switzerland.",
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
    title: "Gstaad Cricket Club | Alpine Cricket Switzerland",
    description:
      "Tradition, sportsmanship, and cricket in the Swiss Alps.",
    images: ["/gstaad-cricket-club-crest.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
          "streetAddress": "Sportzentrum Gstaad",
          "addressLocality": "Gstaad",
          "addressRegion": "Bern",
          "postalCode": "3780",
          "addressCountry": "CH"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 46.4746,
          "longitude": 7.2882
        },
        "memberOf": {
          "@type": "SportsOrganization",
          "name": "Cricket Switzerland"
        }
      },
      {
        "@type": "SportsEvent",
        "@id": "https://gstaadcricketclub.ch/#festival",
        "name": "Gstaad Alpine Cricket Trophy 2026",
        "description": "Annual alpine cricket festival and tournament in Gstaad, Switzerland.",
        "startDate": "2026-09-26T11:00:00+02:00",
        "endDate": "2026-09-26T18:00:00+02:00",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Place",
          "name": "Ebnit School / Sportzentrum Gstaad",
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
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/gstaad-cricket-club-crest.png" type="image/png" />
        <link rel="preload" href="/gstaad-cricket-club-crest.png" as="image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-[var(--gold)] selection:text-[var(--green-dark)]">
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}
