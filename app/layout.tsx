import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { AppProviders } from "@/components/providers/app-providers";
import { getSiteFooterContent } from "@/lib/wordpress";

import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xoomplus.co.uk"),
  title: {
    default: "Xoomplus - Digital Marketing & Web Development Agency",
    template: "%s · Xoomplus",
  },
  description:
    "Grow your businesses with Xoomplus. We deliver expert digital marketing, SEO, web development, and creative solutions to boost traffic and conversions.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const footer = await getSiteFooterContent();

  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrument.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <AppProviders>
          {children}
          <SiteFooter content={footer} />
        </AppProviders>
      </body>
    </html>
  );
}
