import type { Metadata } from "next";
import { headers } from "next/headers";
import { Archivo, Michroma } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/siteUrl";
import { Consent } from "@/components/Consent";

/** Tag-id's zijn configuratie; leeg = niet laden. */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-PW3ZRN99";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "yaxo0wd1xa";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AdventureTravels — actieve sportreizen, dag en avond",
  description: "Kleine groepen, eigen gidsen, verblijf zelf getest. Sport de hele dag, eet als een local zodra het licht kantelt.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Gezet door src/proxy.ts, zodat de hreflang-tags per pagina naar de juiste URL wijzen.
  const pathname = (await headers()).get("x-pathname") ?? "/";
  const pageUrl = new URL(pathname, SITE_URL).toString();

  return (
    <html lang="nl" className={`${archivo.variable} ${michroma.variable}`}>
      <head>
        <link rel="alternate" hrefLang="nl" href={pageUrl} />
        <link rel="alternate" hrefLang="x-default" href={pageUrl} />
      </head>
      <body>
        {children}
        {/* Niets vuurt vóór consent: GTM en Clarity laden pas na een keuze in de banner. */}
        <Consent gtmId={GTM_ID} clarityId={CLARITY_ID} />
      </body>
    </html>
  );
}
