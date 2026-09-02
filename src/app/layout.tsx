import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Archivo, Michroma } from "next/font/google";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adventuretravels.nl";

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
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "yaxo0wd1xa");`}
        </Script>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PW3ZRN99');`}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PW3ZRN99"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
